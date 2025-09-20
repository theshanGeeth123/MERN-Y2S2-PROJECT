// NavBar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import image2 from "./images/hamberger-menu.png"; // hamburger icon
import image3 from "./images/logoNew.png";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // helper to navigate + close mobile menu if open
  const go = (path) => {
    navigate(path);
    if (menuOpen) setMenuOpen(false);
  };

  // Init AOS + close menu on scroll
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Lock body scroll while menu is open
  useEffect(() => {
    const body = document.body;
    if (menuOpen) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [menuOpen]);

  // Close menu when resizing to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    if (mq.matches) setMenuOpen(false);
    mq.addEventListener
      ? mq.addEventListener("change", onChange)
      : mq.addListener(onChange);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", onChange)
        : mq.removeListener(onChange);
    };
  }, []);

  return (
    <nav className="relative w-full px-4 py-3">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between ">
        {/* Logo */}
        <div className="z-50 relative min-w-[40px] min-h-[40px]">
          <button
            type="button"
            aria-label="Go to home"
            onClick={() => go("/")}
            className="focus:outline-none"
          >
            <img
              src={image3}
              alt="Logo"
              className="logo-color w-24 md:w-32 lg:w-40 transition-all duration-300 pt-5"
            />
          </button>
        </div>

        {/* Desktop Navigation (Pill style) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 max-h-[50px]">
          <ul
            className={[
              "rounded-[32px] bg-gray-900/80 backdrop-blur py-3",
              "text-white font-medium tracking-wide",
              "items-center gap-8 xl:gap-12",
              "flex justify-center px-8 xl:px-12",
              "shadow-lg text-base md:text-lg",
            ].join(" ")}
          >
            <li data-aos="fade-down" data-aos-duration="1500" >
              <button
                type="button"
                onClick={() => go("/")}
                className="transition-colors duration-200 py-2 px-1 focus:outline-none hover:cursor-pointer hover:underline hover:underline-offset-8"
              >
                Home
              </button>
            </li>
            <li data-aos="fade-down" data-aos-duration="1800">
              <button
                type="button"
                onClick={() => go("/aboutPage")}
                className="transition-colors duration-200 py-2 px-1 focus:outline-none hover:cursor-pointer hover:underline hover:underline-offset-8"
              >
                About Us
              </button>
            </li>
            <li data-aos="fade-down" data-aos-duration="2100">
              <button
                type="button"
                onClick={() => go("/galleryPage")}
                className="transition-colors duration-200 py-2 px-1 focus:outline-none hover:cursor-pointer hover:underline hover:underline-offset-8"
              >
                Gallery
              </button>
            </li>
            <li data-aos="fade-down" data-aos-duration="2400">
              <button
                type="button"
                onClick={() => go("/contactUs")}
                className="transition-colors duration-200 py-2 px-1 focus:outline-none hover:cursor-pointer hover:underline hover:underline-offset-8"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden z-50 h-12 w-12 flex items-center justify-center rounded-full bg-white/80 border border-white/80 transition-all active:scale-95"
        >
          <img src={image2} alt="Menu" className="h-6 w-6 object-contain" />
        </button>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={`lg:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-40 transition-all duration-500 ease-in-out ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              type="button"
              onClick={() => go("/")}
              className="text-white text-xl font-medium tracking-wide transition-colors py-3 focus:outline-none"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => go("/aboutPage")}
              className="text-white text-xl font-medium tracking-wide transition-colors py-3 focus:outline-none"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => go("/galleryPage")}
              className="text-white text-xl font-medium tracking-wide transition-colors py-3 focus:outline-none"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => go("/contactUs")}
              className="text-white text-xl font-medium tracking-wide transition-colors py-3 focus:outline-none"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
