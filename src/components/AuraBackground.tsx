import { useEffect } from "react";

export function AuraBackground() {
  useEffect(() => {
    // Load UnicornStudio script
    const win = window as any;
    if (!win.UnicornStudio) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (win.UnicornStudio && !win.UnicornStudio.isInitialized) {
          win.UnicornStudio.init();
          win.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }
  }, []);

  return (
    <div 
      className="fixed top-0 w-full h-screen -z-10 aura-background-component" 
      data-alpha-mask="40"
      style={{
        opacity: 0.5,
        maskImage: 'linear-gradient(to bottom, transparent, #ff0d0d 0%, #fffb00 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, #ff0d0d 0%, #fffb00 80%, transparent)'
      }}
    >
      <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
        <div 
          data-us-project="FixNvEwvWwbu3QX9qC3F" 
          className="absolute w-full h-full left-0 top-0 -z-10"
        />
      </div>
    </div>
  );
}

export default AuraBackground;
