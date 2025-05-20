import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dock from "./components/Dock";
import { VscHome, VscProject, VscTools, VscMail } from "react-icons/vsc";

const queryClient = new QueryClient();

const App = () => {
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen">
            <Dock 
              items={items}
            />
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
