import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dock from "./components/Dock";
import { VscHome, VscProject, VscTools, VscMail } from "react-icons/vsc";
import { ThemeProvider } from "./components/ThemeProvider";
import MobileDesktopNotice from "./components/MobileDesktopNotice";
import AuraBackground from "./components/AuraBackground";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => scrollToSection('home') },
    { icon: <VscProject size={18} />, label: 'Projects', onClick: () => scrollToSection('projects') },
    { icon: <VscTools size={18} />, label: 'Skills', onClick: () => scrollToSection('skills') },
    { icon: <VscMail size={18} />, label: 'Contact', onClick: () => scrollToSection('contact') },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuraBackground />
          
          {isLoading && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="logo-zoom-overlay">
                <div className="w-40 h-40 flex items-center justify-center rounded-[30px] drop-shadow-2xl">
                  <img src="/LogoDiv.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          )}

          <BrowserRouter>
            <div className="relative min-h-screen">
              <MobileDesktopNotice />
              <div className="block md:hidden">
                <Dock 
                  items={items}
                />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
