// client/src/AI/components/ImageGeneratorForm.jsx

import React, { useEffect, useState } from "react";
import { generateImage } from "../services/clipdropService";
import NavbarCustomer from "../../components/NavbarCustomer";

const ImageGeneratorForm = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cleanup
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err?.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => setPrompt(text);

  return (

    <><NavbarCustomer/>
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 pt-10  ">
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8 transition-all duration-300 hover:shadow-3xl ">
        {/* Two-column responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT SIDE */}
          <div>
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-400 rounded-2xl shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                Studio AI Image Generator
              </h1>
              <p className="text-gray-600 mt-3 text-sm max-w-lg lg:max-w-none mx-auto lg:mx-0 leading-relaxed">
                Transform your photography concepts into stunning AI-generated visuals.
                Describe lighting, composition, and style for professional results.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="block text-gray-800 font-semibold text-sm uppercase tracking-wide"
                >
                  Describe Your Vision
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: 'A cinematic portrait of a woman in natural light with soft background bokeh, 50mm lens style'"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-700 placeholder-gray-400 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none shadow-sm"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {prompt.length}/500
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-4 font-bold text-white bg-gradient-to-r cursor-pointer from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Your Image...</span>
                  </div>
                ) : (
                  "Generate Image"
                )}
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-100/50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  💡
                </span>
                Photography Prompt Inspiration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Studio portrait with soft lighting and neutral background",
                  "Golden hour outdoor fashion shoot, warm tones",
                  "Product photo on reflective black surface, high contrast",
                  "Wedding couple candid shot, cinematic style",
                  "Flat lay of camera gear with natural shadows",
                  "Model posing with dramatic lighting, low key mood",
                ].map((text, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(text)}
                    className="text-sm bg-white/80 hover:bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 text-left hover:shadow-md hover:scale-[1.02] backdrop-blur-sm"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm">
                <p className="text-red-700 font-medium text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center lg:text-left mt-10 pt-6 border-t border-gray-100/60">
              <p className="text-xs text-gray-400/80 font-medium">
                © 2025 JW-Studio — Powered by ClipDrop 
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-6">
            {imageUrl ? (
              <div className="mt-2 lg:mt-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Generated Image
                  </h2>
                  <p className="text-gray-600 text-sm">Ready for download and use</p>
                </div>
                <div className="relative group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="w-full max-h-[600px] object-contain rounded-xl transition-all duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <a
                      href={imageUrl}
                      download="generated_image.png"
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold backdrop-blur-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center gap-2 border border-white/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder when no image yet
              <div className="mt-2 lg:mt-0 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 via-indigo-50/40 to-purple-50/40 border border-dashed border-gray-300 rounded-2xl p-10 shadow-inner h-full min-h-[400px]">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-gray-600 mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7zm3 10l3-3a2 2 0 012.828 0L15 17m-2-2l1.5-1.5a2 2 0 012.828 0L19 15"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your image will appear here
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Describe your vision on the left and generate an AI-powered image preview here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ImageGeneratorForm;
