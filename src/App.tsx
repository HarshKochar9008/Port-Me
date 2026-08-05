import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Index = lazy(() => import("./pages/Index"));
import NotFound from "./pages/NotFound";
import Dock from "./components/Dock";
import { VscHome, VscProject, VscTools, VscMail } from "react-icons/vsc";
import { ThemeProvider } from "./components/ThemeProvider";
import AuraBackground from "./components/AuraBackground";
import { useState, useEffect } from "react";
import { PortfolioVersionProvider, usePortfolioVersion } from "@/components/portfolio/portfolio-version";
import PortfolioVersionToggle from "@/components/portfolio/PortfolioVersionToggle";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

/**
 * Mobile nav for the Design page only.
 *
 * This used to render for both versions, which stacked it on top of the Real
 * page's own bottom dock — two fixed navigation bars overlapping each other at
 * the foot of every mobile viewport. The Real page ships its own (with an
 * active-section indicator), so this one steps aside for it.
 *
 * A child component rather than a check in App, because the version lives in a
 * context App is the one providing.
 */
const DesignMobileDock = ({ items }: { items: React.ComponentProps<typeof Dock>["items"] }) => {
  const { version } = usePortfolioVersion();
  if (version === "real") return null;
  return (
    <div className="block md:hidden">
      <Dock items={items} />
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3s of splash before any content is a long time to ask a recruiter to wait.
    // Kept long enough to read as intentional, short enough not to cost a visit.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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
    // The page background is forced to #000 in index.css, so the light token set was
    // never actually viable — it just left shadcn components (Contact's bg-muted, inputs,
    // labels) rendering light-theme colours on a black page.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {/* <AuraBackground /> */}
          <PortfolioVersionProvider>
            <PortfolioVersionToggle />
          
          {isLoading && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="logo-zoom-overlay">
                <div className="w-40 h-40 flex items-center justify-center rounded-[30px] drop-shadow-2xl">
                  <img src="/LogoDiv.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          )}

          <BrowserRouter future={{ v7_startTransition: true }}>
            <div className="relative min-h-screen">
              {/* The "best experience on desktop" interstitial used to sit here.
                  Removed: it blocked the page on first visit for the audience
                  most likely to arrive on a phone, and both versions render
                  fine at 390px. The component is still in the repo. */}
              <DesignMobileDock items={items} />
              <Routes>
                <Route path="/" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}><Index /></Suspense>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Vercel Web Analytics. The /react entry (not /next — this is a Vite SPA)
                  patches history itself, so client-side route changes are tracked without
                  any router wiring. No-ops off Vercel, so local dev stays clean. */}
              <Analytics />
            </div>
          </BrowserRouter>
          </PortfolioVersionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
