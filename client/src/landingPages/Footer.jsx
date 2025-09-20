import React from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="lx-footer relative bg-gray-950 px-4 py-8 text-center text-[#f4f4f4] border-t-1  shadow-lg b">
      {/* Subscribe */}
      <div className="lx-footer__subscribe" data-aos="fade-up">
        <h3 className="mb-4 font-medium">
          Stay up to date on the latest from JW Studio
        </h3>
      </div>

      {/* Social icons */}
      <div className="lx-footer__social mt-8" data-aos="fade-up">
        <h4 className="mb-4 font-semibold">Follow JW-STUDIO </h4>
        <div className="lx-footer__icons flex justify-center gap-2">
          {[
            { icon: "fab fa-facebook-f", url: "https://www.facebook.com/jwphotography.lk" },
            { icon: "fab fa-linkedin-in", url: "#" },
            { icon: "fab fa-instagram", url: "#" },
            // { icon: "fab fa-pinterest-p", url: "#" },
            // { icon: "fab fa-quora", url: "#" },
            // { icon: "fab fa-github", url: "#" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-black text-[1.2rem] transition-transform duration-300 hover:scale-110"
            >
              <i className={item.icon}></i>
            </a>
          ))}
        </div>
      </div>

      {/* Meta info */}
      <div className="lx-footer__meta mt-8 text-[#b3b3b3]" data-aos="fade-up">
        <p>
          
          <br />
          
        </p>
        <p className="text-[0.9rem]">
          Copyright © 2025 All rights reserved | Made {" "}
          <span className="text-red-600"></span> by{" "}
          <a href="#" className="text-[#00aaff]">
            JW
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
