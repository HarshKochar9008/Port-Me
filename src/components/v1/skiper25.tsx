"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { cn } from "@/lib/utils";

export interface MusicToggleButtonProps {
  soundUrl?: string;
  className?: string;
}

export const MusicToggleButton = ({ soundUrl, className }: MusicToggleButtonProps) => {
  const bars = 5;

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const [heights, setHeights] = useState(getRandomHeights());
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { pause }] = useSound(soundUrl ?? "/audio/audio.m4a", {
    loop: true,
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
    onpause: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
    soundEnabled: true,
  });

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    }
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  const handleClick = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
      return;
    }
    play();
    setIsPlaying(true);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-end gap-[2px] h-8 w-12" aria-label="Music Bar Visualizer">
        {heights.map((height, index) => (
          <motion.div
            key={index}
            className="w-[3px] rounded-full bg-white/80"
            animate={{ height: `${height * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>

      <button
        onClick={handleClick}
        data-no-drag
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        type="button"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1.5" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="8,5 20,12 8,19" />
          </svg>
        )}
      </button>
    </div>
  );
};
