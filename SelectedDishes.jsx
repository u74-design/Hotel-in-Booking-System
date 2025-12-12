  import React, { useContext, useEffect, useState } from "react";
  import { UserContext } from "./src/components/ui/UseContext.jsx";
  import { Button } from "./src/components/ui/button.jsx";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import toast from "react-hot-toast";

  const SelectedDishes = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [Data, setData] = useState([]);

    useEffect(() => {
      axios
        .get("http://localhost:3001/current-user", { withCredentials: true })
        .then((res) => {
          if (res.data.loggedIn) {
            setUser(res.data.user);
            setLoading(false);
          }
        });
    }, []);

    useEffect(() => {
      axios
        .get("http://localhost:3001/order-list", { withCredentials: true })
        .then((res) => {
          setData(res.data.userData?.orders || []);
        });
    }, []);
    const DeleteDish = async (DishName) => {
        try{
          await axios.delete("http://localhost:3001/delete-dish",{
            data: {DishName},
            withCredentials:true
          })
          setData(Data.filter(d=> d.DishName !== DishName))
          toast.success("Dish Removed!")
        }catch(error){
          res.json({message:"Error while removing"})
          toast.error("Failed to Remove Dish")
        }
    }
    if (loading) return <h1>Loading...</h1>;

    const Total = Data.reduce((sum, item) => sum + Number(item.prize), 0);

    return (
      <div>
        <nav className="bg-white w-full shadow-xl">
          <div className="max-w-6xl mx-auto px-3">
            <div className="flex items-center h-[75px]">
              <div>
                <h1 className="font-bold text-amber-600 text-2xl">Your Order</h1>
                <h1 className="text-lg font-semibold text-gray-700">
                  Table - {user?.Table}{" "}
                  <span className="text-amber-600 font-bold">{user?.Name}</span>
                </h1>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 mt-5 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Order Details</h2>
            <Button onClick={() => navigate("/menu")}>+ Add Dish</Button>
          </div>
          <div className="space-y-4">
            {Data.length === 0 ? (
              <h1 className="text-center text-gray-500">
                No dishes ordered yet.
              </h1>
            ) : (
              Data.map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <h1 className="font-semibold">{d.DishName}</h1>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-orange-600">₹{d.prize}</h1>
                    <Button onClick={()=>DeleteDish(d.DishName)}>Delete</Button>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-between pt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-orange-500">₹{Total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SelectedDishes;
