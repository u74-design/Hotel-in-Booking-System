import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";
import cors from "cors";

const app = express();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const database = client.db("RBS");
const userCollection = database.collection("Customers");
const ManagerCollection = database.collection("Managers");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const customer = (req,res,next)=>{
    if(req.session.userId){
      next();
    }else {
        res.status(401).json({ message: "Please login first" });
    }
}
app.use(
  session({
    secret: "mySuperSecretKey123!@#",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

client.connect().then(() => {
  app.post("/login", async (req, res) => {
    try {
      const { Name, Table, Contact } = req.body;
      const result = await userCollection.insertOne({
        Name,
        Table,
        Contact,
        orders: [],
      });
      req.session.userId = result.insertedId;
      res.status(200).json({ message: "Login Successful", success: true });
    } catch (error) {
      res.status(500).json({ message: "Login Failed" });
    }
  });

  app.post("/order",customer, async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Please login first" });
      const UserId = new ObjectId(req.session.userId);
      const { DishName, prize } = req.body;
      await userCollection.updateOne(
        { _id: UserId },
        { $push: { orders: { DishName, prize, time: new Date() } } }
      );
      res.status(200).json({ success: true, order: { DishName, prize } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Order Failed", error });
    }
  });

  app.get("/current-user",customer, async (req, res) => {
    try {
      if (!req.session.userId) return res.json({ loggedIn: false });
      const user = await userCollection.findOne({
        _id: new ObjectId(req.session.userId),
      });
      res.json({ loggedIn: true, user });
    } catch (error) {
      res.json({ loggedIn: false });
    }
  });

  app.get("/order-list",customer, async (req, res) => {
    try {
      if (!req.session.userId) return res.json({ loggedIn: false });
      const user = await userCollection.findOne({
        _id: new ObjectId(req.session.userId),
      });
      res.json({ loggedIn: true, userData: user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  });
  app.delete("/delete-dish", customer,async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Please login first" });
      }
      const UserId = new ObjectId(req.session.userId);
      const { DishName } = req.body;
      await userCollection.updateOne(
        { _id: UserId },
        { $pull: { orders: { DishName } } }
      );
      res.json({
        message: "Dish Deleted!",
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to Delete!", error });
    }
  });
});
app.get("/manager-data", async (req, res) => {
  try {
    const result = await userCollection.find({}).toArray();
    res.json({ success: true, users: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while Fetching", error });
  }
});
app.post("/confirmed-order", async (req, res) => {
  const { id } = req.body;
  await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "confirmed" } }
  );
  res.json({ success: true });
});
app.post("/manager-signUP",async(req,res)=>{
    const {name,email,password} = req.body;

    try{
      const manager = await ManagerCollection.insertOne({name,email,password});
      if (!manager) {
      return res.status(401).json({ message: "Invalid Credentials", success: false });
      }
      req.session.managerId = manager.insertedId;
      res.status(200).json({
      message:"Successfully SignUp!",
      success:true,
      })
      
    }catch(error){
      res.status(500).json({
        message:"Failed to SignUp!",
        success:false
      })
      
    }
    
})
app.get("/current-manager",async (req,res)=>{
  try{
     if (!req.session.managerId)
    return res.status(401).json({ loggedIn: false });

    const manager = await ManagerCollection.findOne({_id : new ObjectId(req.session.managerId)})
    res.status(200).json({loggedIn : true, manager})
  }catch(error){
    res.status(500).json({message:"Failed to fetch Manager"} , error)
  }
})
app.post("/manageraccount",async(req,res)=>{
    const {email,password} = req.body;
    try{
      const result = await ManagerCollection.findOne({email,password})
      if(!result){
         return res.status(401).json({ message: "Invalid email or password" });
      }
      res.status(200).json({ message : "Login Successful", managerData : result})
    }catch(err){
      res.status(500).json({ message: "Internal server error", err });
    }
})
app.listen(3001);
