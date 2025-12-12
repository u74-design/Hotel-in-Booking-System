import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./src/components/ui/button";
const ManagerLogin = () => {
  const navigate = useNavigate();

  const [name,setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ManageLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3001/manager-signUP",
        {name, email, password },
        { withCredentials: true }
      );

      toast.success("Login Successful!");
      navigate("/manager-dashboard");
    } catch (error) {
      console.log("Internal Error", error);
      toast.error("Error while Login");
    }
  };
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <img
        src="Landing Image.jpg"
        alt="Restaurant"
        className="absolute inset-0 h-full w-full object-cover brightness-50"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Login Card */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white text-black rounded-2xl p-8 shadow-2xl backdrop-blur-lg">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-2xl">👨‍💼</span>
                <h2 className="text-xl font-semibold"> Manager SignUP</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Please enter your credentials
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={ManageLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="name"
                  placeholder="Enter your name"
                  className="bg-white text-black border cursor-pointer hover:border-orange-600 border-gray-300 mt-1 rounded-lg p-3 w-full outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-black border cursor-pointer hover:border-orange-600 border-gray-300 mt-1 rounded-lg p-3 w-full outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="bg-white text-black border cursor-pointer hover:border-orange-600 border-gray-300 mt-1 rounded-lg p-3 w-full outline-none"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full mt-6 py-2 cursor-pointer text-white bg-[#FF7A00] hover:bg-neutral-800 rounded-lg transition"
              >
                SignUP
              </button>
            </form>
            <Button onClick={()=>navigate('/manager-account')}>Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
