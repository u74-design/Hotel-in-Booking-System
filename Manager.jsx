import React, { useState, useEffect } from "react";
import { Button } from "./src/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router";
const Manager = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [Name, setName] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/manager-data", {
        withCredentials: true,
      });

      setData(res.data.users);

      // Load previous status from database
      const statusMap = {};
      res.data.users.forEach((user) => {
        statusMap[user._id] = {
          color: user.status === "confirmed" ? "bg-green-600" : "bg-orange-500",
          text:
            user.status === "confirmed" ? "Order Confirmed!" : "Confirm Order",
          pending: user.status === "confirmed" ? "Confirmed" : "Pending",
        };
      });

      setOrderStatus(statusMap);
    } catch (error) {
      console.log("Error while fetching Data");
    }
  };

  const CurrentManager = async () => {
    try {
      const res = await axios.get("http://localhost:3001/current-manager", {
        withCredentials: true,
      });
      if (res.data.loggedIn) {
        setName(res.data.manager.name);
      }
    } catch (error) {
      console.log("Error while sending password", error);
    }
  };
  useEffect(() => {
    fetchData();
    CurrentManager();
  }, []);

  const confirmedOrder = async (id) => {
    await axios.post("http://localhost:3001/confirmed-order", { id });

    setOrderStatus((prev) => ({
      ...prev,
      [id]: {
        color: "bg-green-600",
        text: "Order Confirmed!",
        pending: "Confirmed",
      },
    }));
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <nav className="bg-white w-full shadow-md">
        <div className="flex items-center h-[75px] justify-between p-5">
          <div>
            <h1 className="font-bold text-amber-600 text-2xl">
              Manager Dashboard
            </h1>
            <span className="text-gray-600">🍽️ Royal Spice Restaurant</span>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="font-bold text-amber-600 text-lg">{Name}</h1>
            <Button
              onClick={() => navigate("/manager-login")}
              className="bg-white border hover:bg-gray-200 rounded-full px-4"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-3 mt-10">
        <h1 className="text-2xl font-bold mb-4">Active Orders</h1>

        {Data.map((customer) => {
          const total = customer.orders.reduce(
            (acc, item) => acc + Number(item.prize),
            0
          );

          return (
            <div
              key={customer._id}
              className="bg-white border rounded-xl shadow-sm p-6 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                    Table {customer.Table}
                  </span>

                  <h2 className="font-semibold text-gray-700">
                    {customer.Name}
                  </h2>
                </div>

                <span className="text-orange-500 bg-orange-100 px-3 py-1 rounded-full text-sm">
                  {orderStatus[customer._id]?.pending || "Pending"}
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Mob: {customer.Contact} • {customer.orders.length} items
              </p>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  Order Items ({customer.orders.length}):
                </h3>

                <ul className="text-gray-700 space-y-1">
                  {customer.orders.map((item, idx) => (
                    <li key={idx}>
                      {item.DishName} — ₹{item.prize}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between mt-3 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>

              <Button
                onClick={() => confirmedOrder(customer._id)}
                className={`${
                  orderStatus[customer._id]?.color || "bg-orange-500"
                } text-white w-full mt-4 py-3 rounded-lg`}
              >
                {orderStatus[customer._id]?.text || "Confirm Order"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Manager;
