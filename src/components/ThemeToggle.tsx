import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  // Get background color of the current page
  const getBackgroundColor = () => {
    // Try to get the background color from the document body
    let bgColor = window.getComputedStyle(document.body).backgroundColor;
    
    // If the background is transparent, try to get it from html
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      bgColor = window.getComputedStyle(document.documentElement).backgroundColor;
    }
    
    return bgColor;
  };

  // Function to notify iframes about theme changes
  const notifyIframesAboutThemeChange = (newTheme: string) => {
    // Find all iframes in the document
    const iframes = document.querySelectorAll('iframe');
    
    // Send message to each iframe
    iframes.forEach(iframe => {
      try {
        if (iframe.contentWindow) {
          // Send theme change
          iframe.contentWindow.postMessage({ 
            type: 'themeChange', 
            theme: newTheme 
          }, '*');
          
          // Also send updated background color
          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: 'setBackground',
                color: getBackgroundColor()
              }, '*');
            }
          }, 50); // Small delay to allow theme to apply first
        }
      } catch (e) {
        console.error('Error sending theme to iframe:', e);
      }
    });
  };

  // Function to handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    notifyIframesAboutThemeChange(newTheme);
  };

  // Listen for theme requests from iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'requestTheme') {
        // Send current theme to the requesting iframe
        if (event.source && typeof event.source.postMessage === 'function') {
          (event.source as WindowProxy).postMessage({ 
            type: 'themeChange', 
            theme: theme 
          }, '*');
        }
      }
      
      // Handle background color requests
      if (event.data && event.data.type === 'requestBackground') {
        // Send current background color to the requesting iframe
        if (event.source && typeof event.source.postMessage === 'function') {
          (event.source as WindowProxy).postMessage({
            type: 'setBackground',
            color: getBackgroundColor()
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [theme]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleThemeToggle}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
