import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface ResumeAnimationProps {
  className?: string;
  height?: string;
  width?: string;
  id?: string;
}

export default function ResumeAnimation({ 
  className = "relative z-5",
  height = "300px", 
  width = "550px",
  id
}: ResumeAnimationProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  
  // Get background color from parent element or document
  const getParentBackgroundColor = () => {
    let bgColor = window.getComputedStyle(document.body).backgroundColor;
    
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      bgColor = window.getComputedStyle(document.documentElement).backgroundColor;
    }
    
    return bgColor;
  };
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const handleIframeLoad = () => {
      if (iframe.contentWindow) {
        // Send theme
        iframe.contentWindow.postMessage({ 
          type: 'themeChange', 
          theme: theme 
        }, '*');
        
        // Send background color
        iframe.contentWindow.postMessage({
          type: 'setBackground',
          color: getParentBackgroundColor()
        }, '*');
      }
    };
    
    iframe.addEventListener('load', handleIframeLoad);
    
    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, [theme]);

  // Update iframe when theme changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    
    // Send theme
    iframe.contentWindow.postMessage({ 
      type: 'themeChange', 
      theme: theme 
    }, '*');
    
    // Send background color
    iframe.contentWindow.postMessage({
      type: 'setBackground',
      color: getParentBackgroundColor()
    }, '*');
  }, [theme]);
  
  // Listen for background color requests from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'requestBackground') {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;
        
        iframe.contentWindow.postMessage({
          type: 'setBackground',
          color: getParentBackgroundColor()
        }, '*');
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Setup MutationObserver to detect background color changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    
    // Function to send background color update
    const updateBackgroundColor = () => {
      iframe.contentWindow?.postMessage({
        type: 'setBackground',
        color: getParentBackgroundColor()
      }, '*');
    };
    
    // Create a MutationObserver to watch for style changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'style' || 
            mutation.attributeName === 'class') {
          updateBackgroundColor();
          break;
        }
      }
    });
    
    // Start observing the document body for style changes
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    // Also observe the html element for theme class changes
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} className={`${className} group relative`}>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
      </div>
      <iframe
        ref={iframeRef}
        src="/resume-animation/index.html"
        title="Resume Animation"
        frameBorder="0"
        scrolling="no"
        height={height}
        width={width}
        style={{
          overflow: 'hidden',
          background: 'transparent',
          pointerEvents: 'auto',
          position: 'relative',
          margin: '0 auto',
          zIndex: '50',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
          aspectRatio: '550/300'
        }}
      ></iframe>
    </div>
  );
} 