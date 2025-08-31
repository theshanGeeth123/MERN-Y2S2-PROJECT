import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function CustomerHomeNavbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

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
            navigate('/');
        } catch (error) {
            toast.error(error.message)
        }
    };
    const viewProfile = () => {
      navigate('/my-profile');
    };
    const viewHome = () => {
      navigate('/customer-home');
    };
    const questionAnswerForm = () => {
      navigate('/customer-questions-answers');
    }
    const feedbackForm = () => {
      navigate('/customer-feedback');
    };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24">
      <img src={assets.pic2} alt="" className="w-28 sm:w-32 " />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                    {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li> }
                    {userData.isAccountVerified && <li onClick={viewHome} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Home</li>}
                    {userData.isAccountVerified &&<li onClick={viewProfile} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">My Profile</li>}
                    {userData.isAccountVerified && <li onClick={questionAnswerForm} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Q&A</li>}
                    {userData.isAccountVerified && <li onClick={feedbackForm} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Feedback Form</li>}
                    <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                </ul>
            </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800
        hover:bg-gray-100 transition-all" 
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}


      

    </div>

    
  );
}

export default CustomerHomeNavbar;
