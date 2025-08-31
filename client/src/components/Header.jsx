import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from "react-router-dom";

function Header() {

  const {userData} = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center
    text-gray-800'>
      <img src={assets.pic1} alt=""  className='w-46 h-46 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ?userData.name:'Developer'} <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
      
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>

      <p className='mb-8 max-w-md'>Let's start with quick product and we will have you up and running in no time .</p>

        <button onClick={() => navigate("/customer-home")} className='border border-gray-500 cursor-pointer rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header
