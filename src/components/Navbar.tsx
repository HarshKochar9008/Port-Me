import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useInView } from "@/lib/animations";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import TrueFocus from "./TrueFocus";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [ref, isInView] = useInView();
  const { theme, setTheme } = useTheme();
  
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <a 
            href="#hero" 
            className="text-xl font-medium text-primary transition-colors hover:text-primary/80"
          >
            <div className="navbar">
              <TrueFocus 
                sentence="Harsh Kochar"
                manualMode={true}
                blurAmount={5}
                borderColor="hsl(var(--primary))"
                animationDuration={0.6}
                pauseBetweenAnimations={0.5}
              />
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button 
              onClick={() => handleNavClick('contact')}
              className="bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Get in touch
            </Button>
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
