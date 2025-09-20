import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

function SwHomeNavbar() {
  const navigate = useNavigate();
  
  const navLinks = [
    { id: "home", title: "Home" },
    { id: "feedback", title: "Feedbacks" },
    { id: "qa", title: "Q&A" },
  ];


  const logout = async () =>{};

 const routeMap = {
    home: "/admin/home",
    feedback: "/admin/admin-feedback",
    qa: "/admin/admin-question",
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-700 text-slate-100 border-b border-slate-800
                flex justify-between items-center p-2 sm:px-16">
        <img src={assets.pic2} alt="" className="w-28 sm:w-32 " />
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
    </nav>
    
  );
}

export default SwHomeNavbar;
