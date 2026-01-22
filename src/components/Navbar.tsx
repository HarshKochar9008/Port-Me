import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useInView } from "@/lib/animations";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [ref, isInView] = useInView();

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
    <header className={`fixed top-5 left-0 right-0 z-[50] transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'py-3' 
        : 'py-5'
    }`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'max-w-5xl' 
          : 'container max-w-6xl'
      }`}>
        <nav className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-background/70 backdrop-blur-xl shadow-lg border-2 border-white rounded-full px-6 py-3' 
            : 'bg-transparent border-2 border-red px-6 py-3 rounded-full'
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
          <ul className="hidden md:flex items-center space-x-8">
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
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button
                onClick={() => handleNavClick('contact')}
                className="inline-flex items-center justify-center h-10 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition"
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


