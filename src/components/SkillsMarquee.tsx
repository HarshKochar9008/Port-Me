import { useRef, useEffect, useState, useCallback } from "react";
import Ribbons from "@/components/Ribbons";
import { skillsData } from "@/data/skills";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SPEED = 0.5;

const MarqueeRow = ({
  skills,
  direction,
  isPaused,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  skills: { name: string; icon: any; color: string }[];
  direction: "left" | "right";
  isPaused: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const lastXRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!contentRef.current || isPaused) return;
    const update = () => {
      const el = contentRef.current;
      if (!el) return;
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth <= 0) return;
      setOffset((prev) => {
        const delta = direction === "left" ? -SPEED : SPEED;
        let next = prev + delta;
        if (next <= -halfWidth) next += halfWidth;
        if (next > 0) next -= halfWidth;
        return next;
      });
    };
    frameRef.current = requestAnimationFrame(function loop() {
      update();
      frameRef.current = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frameRef.current);
  }, [direction, isPaused]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      lastXRef.current = e.clientX;
      onDragStart();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !contentRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      const sign = direction === "left" ? 1 : -1;
      setOffset((prev) => {
        let next = prev + dx * sign;
        const hw = contentRef.current!.scrollWidth / 2;
        if (hw <= 0) return prev;
        if (next <= -hw) next += hw;
        if (next > 0) next -= hw;
        return next;
      });
    },
    [direction, isDragging]
  );

  const handlePointerUp = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  return (
    <div
      className="flex gap-8 py-3 will-change-transform sm:gap-16 sm:py-4"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        transform: `translateX(${offset}px)`,
      }}
      ref={contentRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {[...skills, ...skills].map((item, i) => {
        const Icon = item.icon;
        return (
          <Tooltip key={`${item.name}-${i}`} delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="flex h-12 w-12 select-none items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-110 dark:bg-white/5 sm:h-16 sm:w-16">
                <Icon
                  className="pointer-events-none h-6 w-6 sm:h-8 sm:w-8"
                  style={{
                    color: item.color,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              collisionPadding={16}
              className="font-medium whitespace-nowrap z-[100]"
            >
              {item.name}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

const SkillsMarquee = () => {
  const allSkills = skillsData.flatMap((cat) => cat.items);
  const mid = Math.ceil(allSkills.length / 2);
  const row1Skills = allSkills.slice(0, mid);
  const row2Skills = allSkills.slice(mid);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <section id="skills" className="relative min-h-[auto] overflow-hidden px-4 py-10 sm:px-0 sm:py-16">
      <div className="absolute inset-0 z-0">
        <Ribbons
          baseThickness={30}
          colors={["#ffffff"]}
          speedMultiplier={1}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={true}
        />
      </div>
      <div className="section-container relative z-10 w-full py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-16"
        >
          <div className="inline-block relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/10 blur-lg"></span>
            <span className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
              Expertise
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Skills & Technologies
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-primary/70"
          >
            A comprehensive list of my technical skills and the technologies I work with.
          </motion.p>
        </motion.div>

        <div className="skills-marquee-wrapper relative w-full overflow-hidden py-2">
          <div className="skills-marquee-rows space-y-2">
            <div className="overflow-hidden">
              <MarqueeRow
                skills={row1Skills}
                direction="left"
                isPaused={isDragging}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={isDragging}
              />
            </div>
            <div className="overflow-hidden">
              <MarqueeRow
                skills={row2Skills}
                direction="right"
                isPaused={isDragging}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={isDragging}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsMarquee;
