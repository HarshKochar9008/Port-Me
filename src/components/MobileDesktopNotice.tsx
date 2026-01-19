import { useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "pm_mobile_desktop_notice_dismissed";

export function MobileDesktopNotice() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const alreadyDismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "true";

    if (!alreadyDismissed) {
      setOpen(true);
    }
  }, [isMobile]);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  useEffect(() => {
    if (!isMobile || !open) return;
    if (typeof window === "undefined") return;

    let lastShakeTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const totalAcceleration = Math.sqrt(
        (acc.x || 0) * (acc.x || 0) +
          (acc.y || 0) * (acc.y || 0) +
          (acc.z || 0) * (acc.z || 0)
      );

      const now = Date.now();
      const SHAKE_THRESHOLD = 20; // higher = needs stronger shake
      const SHAKE_COOLDOWN = 1200; // ms

      if (totalAcceleration > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN) {
        lastShakeTime = now;
        handleClose();
      }
    };

    const enableMotion = async () => {
      try {
        // iOS requires explicit permission
        // @ts-ignore
        if (typeof DeviceMotionEvent !== "undefined" && DeviceMotionEvent.requestPermission) {
          // @ts-ignore
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== "granted") return;
        }
      } catch {
        // ignore permission errors and just try to attach listener
      }

      window.addEventListener("devicemotion", handleMotion);
    };

    enableMotion();

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [isMobile, open]);

  if (!isMobile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-xl">
        <div className="flex flex-col items-center bg-background">
          {/* Top grabber */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-muted" />
          </div>

          {/* Illustration placeholder */}
          <div className="mt-2 mb-4 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                HD
              </div>
            </div>
          </div>

          <DialogHeader className="px-6 text-center space-y-2">
            <DialogTitle className="text-lg font-semibold">
              Best experience on desktop
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This portfolio is designed for larger screens with rich animations
              and detailed layouts. For the most immersive experience, open it
              on your laptop or desktop.
            </DialogDescription>
          </DialogHeader>

          {/* Primary action button */}
          <div className="w-full px-6 py-5">
            <Button
              onClick={handleClose}
              className="w-full rounded-2xl py-5 text-base font-semibold"
            >
              Got it, continue on mobile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileDesktopNotice;


