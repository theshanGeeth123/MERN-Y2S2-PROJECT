import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

function CustomerHomeNavbar() {
  const navigate = useNavigate();
  const { setUserData, setIsLoggedin } = useContext(AppContent);
  
  const { userData, loadingUser } = useContext(AppContent);

  const navLinks = [
    { id: "home", title: "Home" },
    { id: "profile", title: "My Profile" },
    { id: "Feedback", title: "Feedback Form" },
    { id: "qa", title: "Q&A" },
  ];

  const sendVerificationOtp = async () =>{
      try {  
          axios.defaults.withCredentials = true;
          const {data} = await axios.post('http://localhost:4000/api/auth/send-verify-otp');
          if(data.success){
              navigate('/email-verify');
              toast.success(data.message);
          }else{
                toast.error(data.message);
          }
      } catch (error) {
          toast.error(error.message);
      }
  }
  const logout = async () =>{
      try {
          localStorage.removeItem('customer');
          axios.defaults.withCredentials = true;
          const {data} = await axios.post('http://localhost:4000/api/auth/logout');
          data.success && setIsLoggedin(false);
          data.success && setUserData(false);
          navigate('/login');
      } catch (error) {
          toast.error(error.message)
      }
  };

 const routeMap = {
    home: "/customer-home",
    profile: "/my-profile",
    Feedback: "/customer-feedback",
    qa: "/customer-questions-answers",
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-700 text-slate-100 border-b border-slate-800
                flex justify-between items-center p-2 sm:px-16">
        <img src={assets.pic2} alt="" className="w-28 sm:w-32 " />
        {userData?.isAccountVerified && (
        <ul className="hidden md:flex items-center gap-14">
          {navLinks.map((nav) => {
            const to = routeMap[nav.id];
            const active = location.pathname.startsWith(to);
            return (
              <li key={nav.id}>  <button onClick={() => navigate(to)} className={`text-sm font-medium transition
                    ${active ? "text-white border-b-2 border-indigo-500 pb-1"  : "text-slate-300 hover:text-white"}`}>
                  {nav.title}</button>
              </li>
            );
          })}
        </ul>
      )}
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                <ul className="list-none text-white sm:flex hidden justify-end items-right flex-1">
                    {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-black-400 cursor-pointer">Verify email</li> }
                    <li onClick={logout} className="py-1 px-2 hover:bg-gray-400 cursor-pointer pr-10">Logout</li>
                </ul>
            </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800
        hover:bg-gray-100 transition-all"   >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </nav>
    
  );
}

export default CustomerHomeNavbar;
