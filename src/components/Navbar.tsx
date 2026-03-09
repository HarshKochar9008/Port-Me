import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed left-0 right-0 top-16 z-[50] transition-all duration-500 ease-in-out sm:top-5 ${
      scrolled 
        ? 'py-2 sm:py-3' 
        : 'py-3 sm:py-5'
    }`}>
      <div className={`mx-auto px-3 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'max-w-5xl' 
          : 'container max-w-6xl'
      }`}>
        <nav className={`flex items-center justify-between gap-3 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'rounded-2xl border border-white/30 bg-background/70 px-3 py-2 shadow-lg backdrop-blur-xl sm:rounded-full sm:px-6 sm:py-3' 
            : 'rounded-2xl border border-white/10 bg-background/40 px-3 py-2 backdrop-blur sm:rounded-full sm:bg-transparent sm:px-6 sm:py-3'
        }`}>
          <a 
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="text-xl font-medium text-primary transition-colors hover:text-primary/80 relative"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-900 to-blue-500 flex items-center justify-center rounded-[10px] shadow-lg transition-all duration-300 hover:scale-110">
              <img src="/Logo.png" alt="Logo" className="h-13 w-11" />
            </div>
          </a>
          <ul className="hidden items-center space-x-8 md:flex">
            {['projects', 'skills', 'contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="text-foreground/80 hover:text-foreground transition-colors relative link-underline py-1"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <Button
                onClick={() => handleNavClick('contact')}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition hover:bg-primary/90 sm:h-10 sm:px-4 sm:text-base"
                aria-label="Get in touch"
              >
                Get in touch
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;    
// import React from "react";
// import "./Nav.css";
// import { useState } from "react";
// import { FaHome, FaBookOpen, FaUserAlt } from "react-icons/fa";
// import { AiFillMessage } from "react-icons/ai";
// import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";          
// const Nav = () => {
//   const [nav, setNav] = useState("#"); 
//   return (
//     <nav>
//       <a
//         href="#"
//         onClick={() => setNav("#")}
//         className={nav === "#" ? "action" : ""}
//       >
//         <FaHome />
//       </a>
//       <a
//         href="#projects"
//         onClick={() => setNav("#projects")}
//         className={nav === "#projects" ? "action" : ""}
//       >
//         <FaUserAlt />
//       </a>
//       <a
//         href="#skills"
//         onClick={() => setNav("#skills")}
//         className={nav === "#skills" ? "action" : ""}
//       >
//         <FaBookOpen />
//       </a>
//       <a
//         href="#contact"
//         onClick={() => setNav("#contact")}
//         className={nav === "#contact" ? "action" : ""}
//       >
//         <AiFillMessage />
//       </a>
//     </nav>
//   );
// };

// export default Nav;


