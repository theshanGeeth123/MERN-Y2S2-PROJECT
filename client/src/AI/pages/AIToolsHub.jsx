

import React from "react";
import { useNavigate } from "react-router-dom";
import { Image, Scissors, Sparkles } from "lucide-react"; 

import NavbarCustomer from "../../components/NavbarCustomer";

const AIToolsHub = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Text-to-Image Generator",
      description:
        "Create stunning photography concepts from text. Perfect for planning creative shoots, moodboards, or digital mockups.",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      route: "/ai/image-generator",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Background Removal",
      description:
        "Instantly remove backgrounds from product or portrait photos. Get transparent PNGs ready for catalogs and editing.",
      icon: <Scissors className="w-8 h-8 text-white" />,
      route: "/ai/background-removal",
      gradient: "from-green-500 to-teal-500",
    },
  ];

  return (
    <><NavbarCustomer/>
    <div className="min-h-screen  flex flex-col items-center justify-center p-8 2xl:min-w-[180px] 2xl:mx-30 xl:mx-20 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-black tracking-tight ">
          JW-Studio AI Tools Center
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm mb-12">
          Welcome to JW Studio’s AI suite — designed to enhance your photography workflow.  
          Select a tool below to generate images or edit your existing photos effortlessly.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {tools.map((tool, i) => (
          <div
            key={i}
            onClick={() => navigate(tool.route)}
            className={`group cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all p-8 flex flex-col items-center text-center hover:-translate-y-1`}
          >
            <div
              className={`p-4 rounded-full bg-gradient-to-br ${tool.gradient} bg-opacity-10 mb-4`}
            >
              {tool.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {tool.title}
            </h2>
            <p className="text-gray-600 text-sm mb-5">{tool.description}</p>
            <button
              className={`px-5 cursor-pointer py-2 rounded-lg bg-gradient-to-r ${tool.gradient} text-white font-semibold shadow hover:opacity-90 transition`}
            >
              Open Tool
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-10">
        © 2025 StudioAI — Powered by ClipDrop | JW-Studio
      </p>
    </div>
    </>
  );
};

export default AIToolsHub;
