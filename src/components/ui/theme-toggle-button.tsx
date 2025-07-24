"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import React from "react";

type ThemeTogglerProps = {
  variant?: "circle" | "circle-blur" | "gif";
  start?: string;
  url?: string;
  showLabel?: boolean;
};

export default function ThemeToggler({
  variant = "circle-blur",
  start = "top-right",
  url = "",
  showLabel = false,
}: ThemeTogglerProps) {
  const { theme, setTheme } = useTheme();

  const switchTheme = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("light");
        break;
      default:
        break;
    }
  };

  const toggleTheme = () => {
    //@ts-ignore
    if (!document.startViewTransition) switchTheme();
    //@ts-ignore
    document.startViewTransition(switchTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={`rounded-full ${variant} ${start}`}
      {...(variant === "gif" && url ? { as: "a", href: url } : {})}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && <span className="sr-only">Toggle theme</span>}
    </Button>
  );
}
