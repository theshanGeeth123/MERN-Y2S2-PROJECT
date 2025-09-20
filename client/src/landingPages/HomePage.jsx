import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "./Footer";

import image1 from "./images/cody-lannom-G95AReIh_Ko-unsplash.jpg"; 
import image2 from "./images/hamberger-menu.png";              
import image3 from "./images/logoNew.png";                    

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Inject Google Font (Poppins)
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Show/Hide "to top" button based on header visibility
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowToTop(!entry.isIntersecting),
      { root: null, threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ESC to close menu + lock scroll when open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    // Lock page scroll when menu is open
    const root = document.documentElement;
    if (menuOpen) root.style.overflow = 'hidden'; else root.style.overflow = '';
    return () => {
      document.removeEventListener('keydown', onKey);
      root.style.overflow = '';
    };
  }, [menuOpen]);

  // Smooth scroll to top
  const handleToTop = (e) => {
    e.preventDefault();

    const startY = window.scrollY || document.documentElement.scrollTop;
    const duration = 1200; // ms
    const startTime = performance.now();
    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, Math.round(startY * (1 - eased)));
      if (elapsed < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="font-[Poppins] text-[var(--text-dark)] ">
      {/* ===== Header / First Section ===== */}
      <header id="top" ref={headerRef} className="relative isolate">
        <nav
          className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-[1200px] px-4 py-4 flex items-center justify-between"
          aria-label="Primary"
        >
          {/* Desktop logo */}
          <div className="hidden lg:block">
            <button onClick={() => go('/')} aria-label="Go home">
              <img src={image3} alt="Logo" className="logo-color max-w-[120px]" />
            </button>
          </div>

          {/* Mobile logo */}
          <div className="block lg:hidden">
            <button onClick={() => go('/')} aria-label="Go home">
              <img src={image3} alt="Logo" className="logo-color max-w-[120px] max-sm:max-w-[90px] max-sm:mt-6 max-sm:ml-[-20px]" />
            </button>
          </div>

          {/* Desktop nav (center pill) */}
          <ul
            className=" rounded-[32px] bg-black/50 backdrop-blur py-3 text-white font-semibold items-center gap-5 transition-all duration-300  w-[50%] lg:flex justify-between px-20 z-30 absolute left-1/2 -translate-x-1/2 top-10 max-lg:hidden"
          >
            
            <li><button onClick={() => go('/aboutPage')} className="hover:opacity-90 hover:cursor-pointer" data-aos="fade-down" data-aos-duration="1800">About Us</button></li>
            <li><button onClick={() => go('/galleryPage')} className="hover:opacity-90 hover:cursor-pointer" data-aos="fade-down" data-aos-duration="2100">Gallery</button></li>
            <li><button onClick={() => go('/contactUs')} className="hover:opacity-90 hover:cursor-pointer" data-aos="fade-down" data-aos-duration="2400">Contact Us</button></li>
            <li><button onClick={() => go('/main-home')} className="hover:opacity-90 hover:cursor-pointer" data-aos="fade-down" data-aos-duration="2700">SignIn</button></li>
          </ul>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="mt-11 lg:hidden absolute right-4 top-3 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 border border-black/10 shadow-sm active:scale-95 transition"
          >
            {/* Prefer icon font; fall back to image if desired */}
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`} aria-hidden="true" />
            {/* Or use the provided asset: <img src={image2} alt="Menu" className="h-6 w-6 object-contain" /> */}
          </button>
        </nav>

        {/* ===== Hero ===== */}
        <div className="header__container mb-30 grid md:[grid-template-columns:minmax(1rem,1fr)_minmax(0,calc(1200px*0.4))_minmax(0,calc(1200px*0.6))_minmax(1rem,1fr)] md:items-center">
  {/* Background image block */}
  <div
    className="header__image relative -z-[100] min-h-[500px] md:min-h-[650px] md:[grid-area:1/3/2/5] bg-cover bg-center bg-no-repeat rounded-bl-[8rem] ml-[13%] md:ml-10"
    data-aos="fade-left"
    data-aos-duration="2000"
    style={{ backgroundImage: `url(${image1})` }}
  />

  <div className="header__content text-center px-4 py-16 md:pt-40 md:col-start-2 md:col-end-3 md:text-left">
    <h1
      data-aos="fade-right"
      data-aos-duration="2000"
      className="text-[4rem] leading-[3rem] font-bold md:text-[5rem] md:leading-[4rem] text-[var(--text-dark)]"
    >
      CAPTURE
    </h1>
    <h2
      data-aos="fade-left"
      data-aos-duration="2000"
      className="mb-8 text-[4rem] leading-[3rem] font-extralight md:text-[5rem] md:leading-[4rem] text-[var(--text-dark)]"
    >
      EVERY MOMENT
    </h2>
    <p
      data-aos="fade-up"
      data-aos-duration="2000"
      className="mb-8 text-[var(--text-dark)]"
    >
      At <b>JW-Studio</b>, we believe every picture tells a story. 
      From timeless portraits to cinematic wedding films, 
      our passion is to frame your memories with creativity, artistry, and precision. 
    </p>
    <div data-aos="zoom-in" data-aos-duration="2000">
      <a href="#banner">
        <button
          className="cursor-pointer rounded-[5px] bg-black px-6 py-3 text-white transition hover:bg-[rgba(25,24,23,0.8)]"
        >
          Explore now
        </button>
      </a>
    </div>
  </div>
</div>


        {/* ===== Mobile menu overlay ===== */}
        {menuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-40 lg:hidden"
            
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100 transition-opacity"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <div  data-aos="fade-left"
              className="absolute right-0 top-0 h-full w-[82%] max-w-[360px] bg-white text-black shadow-2xl
                         translate-x-0 animate-[slideIn_.25s_ease-out]c "
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-black/10">
                <img src={image3} alt="Logo" className="h-10 w-auto" />
                <button
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white active:scale-95"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className="px-4 py-3 ">
                <button onClick={() => go('/main-home')} className="w-full text-left px-3 py-3 rounded-lg hover:bg-black/5">SignIn</button>
                <button onClick={() => go('/aboutPage')} className="w-full text-left px-3 py-3 rounded-lg hover:bg-black/5">About Us</button>
                <button onClick={() => go('/galleryPage')} className="w-full text-left px-3 py-3 rounded-lg hover:bg-black/5">Gallery</button>
                <button onClick={() => go('/contactUs')} className="w-full text-left px-3 py-3 rounded-lg hover:bg-black/5">Contact Us</button>
              </div>

              <div className="mt-auto px-4 py-6 text-xs text-black/60">
                <p>© {new Date().getFullYear()} JW Studio</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== Banner ===== */}
      <div className="banner mt-20 grid md:[grid-template-columns:repeat(6,minmax(0,1fr))] bg-black md:mt-0" id="banner">
  {/* Card 1 (full bleed dark with content overlay style) */}
  <div className="relative isolate py-20 px-8 md:col-span-2 bg-[#090909b9]" data-aos="fade-up" data-aos-duration="1500" />

  <div  className="px-8 py-8 bg-[#231f1f] text-[aliceblue] z-10" data-aos="fade-up" data-aos-duration="1700">
    <h4 className="text-[1.2rem] font-medium text-[aliceblue]">Equipment Rentals</h4>
    <p className="mb-2 text-[0.9rem] text-[rgba(240,248,255,0.69)]">
      From professional cameras and lenses to studio lighting and tripods — rent everything you need for your next shoot at affordable rates.
    </p>
    <a href="#" className="text-white font-semibold text-[1rem]">Learn More</a>
  </div>

  <div className="px-8 py-8 bg-[#2a2c32] text-[aliceblue] z-10" data-aos="fade-up" data-aos-duration="1900">
    <h4 className="text-[1.2rem] font-medium text-[aliceblue]">Studio Sessions</h4>
    <p className="mb-2 text-[0.9rem] text-[rgba(240,248,255,0.69)]">
      Book a professional photography session with our in-house team. Perfect for portraits, product shoots, and creative projects.
    </p>
    <a href="#" className="text-white font-semibold text-[1rem]">Book a Session</a>
  </div>

  <div className="px-8 py-8 bg-[#3f414b]" data-aos="fade-up" data-aos-duration="2100">
    <h4 className="text-[1.2rem] font-medium text-[aliceblue]">Shop & Accessories</h4>
    <p className="mb-2 text-[0.9rem] text-[rgba(240,248,255,0.69)]">
      Explore our collection of cameras, gear, and accessories available for purchase to upgrade your photography experience.
    </p>
    <a href="#" className="text-white font-semibold text-[1rem]">Shop Now</a>
  </div>
</div>


      {/* ===== Packages (Glass • Smooth) ===== */}
     <section
  id="packages"
  aria-labelledby="packages-bw-heading"
  className="relative"
  style={{ backgroundColor: "#0a0a0a", color: "#f5f5f5" }}
>
  <div className="mx-auto max-w-[1200px] px-[clamp(2rem,4vw,4rem)] py-[clamp(2rem,4vw,4rem)]">
    <div className="mb-[clamp(1.5rem,3vw,2.5rem)] grid gap-3" data-aos="fade-up">
      <span className="tracking-[0.22em] uppercase text-[#cfcfcf] font-semibold text-[0.8rem]">
        Studio Packages
      </span>
      <h2 id="packages-bw-heading" className="m-0 text-[clamp(1.75rem,2.8vw,3rem)] leading-[1.15]">
        Choose a shoot today — scale your creativity tomorrow.
      </h2>
      <p className="m-0 max-w-[65ch] text-[#d8d8d8]">
        Book photography sessions, rent pro gear, and purchase accessories in one place.
        Packages below are examples—swap with your real studio pricing and inclusions anytime.
      </p>
    </div>

    <div
      className="grid grid-cols-12 gap-[clamp(1rem,2vw,1.5rem)]"
      data-aos="fade-down"
      data-aos-duration="1500"
    >
      {/* Starter */}
      <article
        aria-label="Starter plan"
        data-aos="zoom-in"
        className={[
          "packages-bw__reveal col-span-12 sm:col-span-6 lg:col-span-4",
          "relative isolate overflow-hidden rounded-2xl border border-white/15",
          "bg-white/5 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transform-gpu [will-change:transform]",
          "transition-[transform,box-shadow,opacity] duration-200 ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          "after:pointer-events-none after:absolute after:-left-1/2 after:-top-full after:h-[200%] after:w-[120%]",
          "after:rotate-[8deg] after:bg-[linear-gradient(105deg,transparent_0_35%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.08)_55%,transparent_65%_100%)]",
          "after:translate-x-[-40%] after:transition-transform after:duration-300 hover:after:translate-x-[55%]",
        ].join(" ")}
      >
        <div className="relative z-[2] p-[1.4rem]">
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-[0.6rem] py-[0.35rem] text-[0.72rem] font-bold tracking-[0.12em] text-[#cfcfcf] uppercase">
            Starter
          </span>
          <h3 className="m-0 mt-[0.9rem] mb-[0.35rem] text-[1.45rem] leading-[1.2]">
            Mini Session<br></br> Essentials
          </h3>
          <p className="m-0 mb-[0.9rem] text-[0.95rem] text-[#cfcfcf]">
            Perfect for portraits &amp; quick campaigns
          </p>
          <p className="m-0 mb-[0.6rem] mt-[0.2rem] text-[2rem] font-extrabold">
            $50 <small className="text-[0.9rem] font-semibold text-[#cfcfcf]">/ one-time</small>
          </p>
          <ul className="m-0 list-none p-0">
            {[
              "45-minute studio shoot (1 backdrop)",
              "5 expertly edited photos (web & print)",
              "Basic gear included (lighting + tripod)",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 border-b border-dashed border-white/15 py-[0.55rem] last:border-b-0"
              >
                <span className="relative h-[0.95rem] w-[0.95rem] flex-none rounded-[3px] border border-white/25 bg-[linear-gradient(180deg,#111,#0d0d0d)] after:content-[''] after:absolute after:left-[0.12rem] after:top-[0.18rem] after:h-[0.25rem] after:w-[0.55rem] after:rotate-305 after:scale-x-[-1] after:translate-x-[1px] after:-translate-y-[1px] after:border-2 after:border-white after:border-l-0 after:border-t-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* Pro (Featured) */}
      <article
        aria-label="Pro plan"
        data-aos="zoom-in"
        className={[
          "packages-bw__reveal col-span-12 sm:col-span-6 lg:col-span-4",
          "relative isolate overflow-hidden rounded-2xl border border-white/20",
          "bg-white/7 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transform-gpu [will-change:transform]",
          "transition-[transform,box-shadow,opacity] duration-200 ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          "after:pointer-events-none after:absolute after:-left-1/2 after:-top-full after:h-[200%] after:w-[120%]",
          "after:rotate-[8deg] after:bg-[linear-gradient(105deg,transparent_0_35%,rgba(255,255,255,0.10)_45%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0.10)_55%,transparent_65%_100%)]",
          "after:translate-x-[-40%] after:transition-transform after:duration-300 hover:after:translate-x-[55%]",
        ].join(" ")}
      >
        <div className="relative z-[2] p-[1.4rem]">
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-[0.6rem] py-[0.35rem] text-[0.72rem] font-bold tracking-[0.12em] text-[#e9e9e9] uppercase">
            Most Popular
          </span>
        <h3 className="m-0 mt-[0.9rem] mb-[0.35rem] text-[1.45rem] leading-[1.2]">
            Studio Pro <br /> Bundle
          </h3>
          <p className="m-0 mb-[0.9rem] text-[0.95rem] text-[#cfcfcf]">
            Ideal for brands, couples, &amp; products
          </p>
          <p className="m-0 mb-[0.6rem] mt-[0.2rem] text-[2rem] font-extrabold">
            $100 <small className="text-[0.9rem] font-semibold text-[#cfcfcf]">/ one-time</small>
          </p>
          <ul className="m-0 list-none p-0">
            {[
              "2-hour studio session + lighting assistant",
              "15 edited photos + contact sheet",
              "Optional gear add-ons (lenses, modifiers)",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 border-b border-dashed border-white/15 py-[0.55rem] last:border-b-0"
              >
                <span className="relative h-[0.95rem] w-[0.95rem] flex-none rounded-[3px] border border-white/25 bg-[linear-gradient(180deg,#111,#0d0d0d)] after:content-[''] after:absolute after:left-[0.12rem] after:top-[0.18rem] after:h-[0.25rem] after:w-[0.55rem] after:rotate-305 after:scale-x-[-1] after:translate-x-[1px] after:-translate-y-[1px] after:border-2 after:border-white after:border-l-0 after:border-t-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* Elite */}
      <article
        aria-label="Elite plan"
        data-aos="zoom-in"
        className={[
          "packages-bw__reveal col-span-12 sm:col-span-6 lg:col-span-4",
          "relative isolate overflow-hidden rounded-2xl border border-white/15",
          "bg-white/5 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transform-gpu [will-change:transform]",
          "transition-[transform,box-shadow,opacity] duration-200 ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          "after:pointer-events-none after:absolute after:-left-1/2 after:-top-full after:h-[200%] after:w-[120%]",
          "after:rotate-[8deg] after:bg-[linear-gradient(105deg,transparent_0_35%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.08)_55%,transparent_65%_100%)]",
          "after:translate-x-[-40%] after:transition-transform after:duration-300 hover:after:translate-x-[55%]",
        ].join(" ")}
      >
        <div className="relative z-[2] p-[1.4rem]">
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-[0.6rem] py-[0.35rem] text-[0.72rem] font-bold tracking-[0.12em] text-[#cfcfcf] uppercase">
            Elite
          </span>
          <h3 className="m-0 mt-[0.9rem] mb-[0.35rem] text-[1.45rem] leading-[1.2]">
            Full-Day &amp; <br /> Commercial
          </h3>
          <p className="m-0 mb-[0.9rem] text-[0.95rem] text-[#cfcfcf]">
            For campaigns, teams, and catalogs
          </p>
          <p className="m-0 mb-[0.6rem] mt-[0.2rem] text-[2rem] font-extrabold">
            $200 <small className="text-[0.9rem] font-semibold text-[#cfcfcf]">/ one-time</small>
          </p>
          <ul className="m-0 list-none p-0">
            {[
              "Full-day studio + crew & set support",
              "Unlimited gear package (bodies, lenses, lights)",
              "Priority retouching & same-day previews",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 border-b border-dashed border-white/15 py-[0.55rem] last:border-b-0"
              >
                <span className="relative h-[0.95rem] w-[0.95rem] flex-none rounded-[3px] border border-white/25 bg-[linear-gradient(180deg,#111,#0d0d0d)] after:content-[''] after:absolute after:left-[0.12rem] after:top-[0.18rem] after:h-[0.25rem] after:w-[0.55rem] after:rotate-305 after:scale-x-[-1] after:translate-x-[1px] after:-translate-y-[1px] after:border-2 after:border-white after:border-l-0 after:border-t-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>

    <div
      className="my-8 h-px bg-[linear-gradient(90deg,transparent,#2a2a2a,transparent)]"
      role="presentation"
    />
    <p className="mt-1 text-[0.9rem] text-[#cfcfcf]">
      Package details are placeholders for a camera studio. Replace titles, prices, and features with your actual offerings anytime.
    </p>
  </div>
</section>


      <div className="bg-black"><Footer/></div>

      {/* Back to top */}
      <a
        href="#top"
        className="lx-footer__to-top fixed bottom-5 right-5 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-black shadow-[0_0_10px_rgba(0,0,0,0.4)] transition-opacity transition-transform duration-300"
        onClick={handleToTop}
        style={{
          opacity: showToTop ? 1 : 0,
          pointerEvents: showToTop ? 'auto' : 'none',
          transform: showToTop ? 'scale(1)' : 'scale(0.95)',
        }}
        aria-label="Back to top"
        title="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </a>
    </div>
  );
}

/* Tailwind keyframes for the slide in (optional) — add to your globals if you want smoother entrance
@keyframes slideIn {
  from { transform: translateX(16px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
*/
