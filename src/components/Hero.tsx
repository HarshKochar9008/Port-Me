import { Button } from "@/components/ui/button";
import { useInView } from "@/lib/animations";
import { ArrowDown } from "lucide-react";
import ShapeBlurContainer from "./ShapeBlurContainer";
import { useEffect, useState } from "react";
import "@/styles/animations.css";

const Hero = () => {
  const [ref, isInView] = useInView();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const words = ["Full-Stack Developer", "Web3 Developer", "AI Developer", "UI/UX Designer"];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFlipping(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      ref={ref}
      className="relative left-0 right-0 top-0 z-[1] mt-0 flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">

        <ShapeBlurContainer 
          shapeSize={isMobile ? 1.2 : 1.5}
          shapeWidth={isMobile ? 1.65 : 1.85}
          shapeHeight={isMobile ? 1.5 : 0.8}
          roundness={isMobile ? 0.4 : 0.5}
          borderSize={isMobile ? 0.025 : 0.02}
        />

        <div className="absolute top-1/3 -right-16 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -left-16 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full filter blur-3xl animate-float animation-delay-500"></div>
      </div>
      
      <div className="section-container relative z-10 px-0">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-6 sm:mb-6 animate-fade-in">
            <span className={`inline-block transition-all duration-500 transform hover:scale-105 ${isFlipping ? 'animate-flip-out' : 'animate-flip-in'}`}>
              {words[currentWordIndex]}
            </span>
          </span>
          
          <h1 className="mb-4 text-3xl font-bold leading-tight animate-fade-in animation-delay-100 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            <div className="mb-4">Hey, I'm <span className="text-primary italic text-effect-shadow">Harsh</span></div>
            <div className="text-2xl sm:text-3xl md:text-5xl">I turn imagination into interaction...</div>
          </h1>
          
          <p className="mb-8 max-w-xl text-base text-muted-foreground animate-fade-in animation-delay-200 sm:mb-10 sm:text-lg md:text-xl">
            I design and ship robust web apps, smart contracts, and user-friendly applications with modern technologies.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 animate-fade-in animation-delay-300">
            <Button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full rounded-md px-6 py-3 text-base sm:w-auto"
            >
              View projects
            </Button>
            
            <Button 
              onClick={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="w-full rounded-md border-white px-6 py-3 text-base text-foreground hover:bg-accent sm:w-auto"
            >
              My Resume
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-5 left-1/2 block -translate-x-1/2 transform animate-bounce sm:bottom-8">
        <button 
          onClick={handleScrollDown}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-md text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
