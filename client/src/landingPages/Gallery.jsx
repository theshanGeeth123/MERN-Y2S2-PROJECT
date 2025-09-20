import React, { useMemo, useState } from "react";
import img1 from '../assets/images/GalleryCoverimage.jpg'

import i1 from './gallery_images/img1.jpg'
import i2 from './gallery_images/i2.jpeg'
import i3 from './gallery_images/i3.jpeg'
import i4 from './gallery_images/i4.jpeg'
import i5 from './gallery_images/i5.jpeg'
import i6 from './gallery_images/i6.jpeg'
import i7 from './gallery_images/i7.jpeg'
import i8 from './gallery_images/i8.jpeg'
import i9 from './gallery_images/i9.jpeg'
import i10 from './gallery_images/i10.jpeg'
import i11 from './gallery_images/i11.jpeg'
import i12 from './gallery_images/i12.jpeg'
import i13 from './gallery_images/i13.jpeg'
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function Gallery() {

   const navigate = useNavigate();

  const [active, setActive] = useState("All");

  const categories = ["All", "Event", "Fashion", "Wedding"];

  const images = useMemo(
    () => [
      
      { src: i1, alt: "", tag: "Wedding" },
      { src: i4, alt: "", tag: "Wedding" },
      { src: i5, alt: "", tag: "Event" },
      { src: i2, alt: "", tag: "Wedding" },
      
      
      { src: i6, alt: "", tag: "Fashion" },
      { src: i3, alt: "", tag: "Wedding" },
      { src: i8, alt: "", tag: "Event" },
        { src: i11, alt: "", tag: "Event" },
        { src: i10, alt: "", tag: "Event" },
      { src: i7, alt: "", tag: "Fashion" },
     
      { src: i9, alt: "", tag: "Event" },
      
     
      { src: i12, alt: "", tag: "Fashion" },
      
      
    ],
    []
  );

  const filtered = active === "All" ? images : images.filter((i) => i.tag === active);

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row pb-16 lg:pb-24 lg:mx-4 xl:mx-40  ">
        {/* Left: content */}
        <div className="basis-full lg:basis-2/5 p-6 lg:p-10 flex items-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              Capture Your Beautiful Moments
            </h1>
            <p className="mt-6 text-gray-600 md:text-lg leading-relaxed">
              From intimate portraits to grand celebrations, we craft timeless images
              you'll love to revisit. Let's plan your perfect shoot.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                onClick={() => navigate('/contactUs')}
                className="inline-flex items-center rounded-xl bg-gray-900 px-6 py-3.5 text-white font-medium shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Contact Us
              </a>
              <a
                href="#gallery-section"
                className="inline-flex items-center rounded-xl border border-gray-300 px-6 py-3.5 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>

        {/* Right: image */}
        <div
          className="basis-full lg:basis-3/5 relative flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mx-4 lg:mx-0 shadow-lg"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <img
            src={img1}
            alt="JW Studio collage"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery-section" className="py-16 bg-gradient-to-b from-gray-900 to-black rounded-t-[40px] mt-8">
        {/* Local CSS-in-JSX for small animation to mimic the original .animate/zoom */}
        <style>{`
          @keyframes zoom { 
            from { transform: scale(0.92); opacity: .6 } 
            to { transform: scale(1); opacity: 1 } 
          }
          .animate-zoom { animation: zoom .35s ease-in 1 }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase text-white">
              Gal<span className="text-red-600">lery</span>
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          {/* Filter Pills */}
          <div className="flex justify-center mb-12 md:mb-16">
            <div className="inline-flex flex-wrap justify-center gap-3 md:gap-4 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm" data-aos="flip-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={active === cat}
                  className={`px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold uppercase tracking-wide transition-all duration-300 ${
                    active === cat
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" >
            {filtered.map((img, idx) => (
              <div data-aos="fade-up"
                key={`${img.src}-${idx}`}
                className="group overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <figure className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 animate-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-4 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-sm font-medium">{img.tag}</p>
                      <p className="text-xs opacity-90 mt-1">{img.alt}</p>
                    </div>
                  </div>
                </figure>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}