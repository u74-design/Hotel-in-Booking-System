import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const ManagerLogin = () => {
    
    const navigate = useNavigate()
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    const Login = async() => {
        try{
            const res = await axios.post("http://localhost:3001/manageraccount",
            {email,password},
            {withCredentials : true}
            )
            if (!res.data.managerData) {
            toast.error("Invalid Email or Password!");
            return;
            }
            navigate("/manager-dashboard")
            toast.success("Login Successful!")
        }catch(err){
            toast.error("Login Failed!");
            console.log(err);
        }

    }
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

      {/* Centered Login Card */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white text-black rounded-2xl p-8 shadow-2xl backdrop-blur-lg">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-2xl">👨‍💼</span>
                <h2 className="text-xl font-semibold">Manager Login</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Please enter your credentials
              </p>
            </div>

            {/* Email */}
            
            <div className="space-y-2 mb-5">
              <label className="text-sm font-medium">Email</label>
              <input
                onChange={(e)=>setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="bg-white text-black border hover:border-orange-600 border-gray-300 mt-1 rounded-lg p-3 w-full outline-none cursor-pointer"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium">Password</label>
              <input
                onChange={(e)=>setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="bg-white text-black border hover:border-orange-600 border-gray-300 mt-1 rounded-lg p-3 w-full outline-none cursor-pointer"
              />
            </div>

            {/* Login Button */}
            <button
                onClick={Login}
              className="w-full py-2 text-white bg-[#FF7A00] hover:bg-neutral-800 rounded-lg transition cursor-pointer"
            >
              Login
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
