import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { Project } from "@/types";

interface StickyCardProps {
  i: number;
  title: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const StickyCard = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: StickyCardProps) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-0 flex items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="rounded-4xl relative -top-1/4 flex h-[500px] w-[900px] max-w-[95vw] origin-top flex-col overflow-hidden md:h-[600px]"
      >
        <img 
          src={src} 
          alt={title} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
          <h3 className="text-3xl font-bold text-white drop-shadow-2xl md:text-4xl">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

interface StickyProjectsProps {
  projects: Project[];
}

const StickyProjects = ({ projects }: StickyProjectsProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh]"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center pointer-events-none z-10">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down to see card stack
          </span>
        </div>

        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.5,
            1 - (projects.length - i - 1) * 0.1,
          );

          return (
            <StickyCard
              key={project.id}
              i={i}
              title={project.title}
              src={project.image}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export { StickyProjects, StickyCard };

