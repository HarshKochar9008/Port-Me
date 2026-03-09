import { useEffect, useRef, useState } from "react";
import { projects } from "@/components/ProjectCard";
import fein from "@/fein2.mp3";
import { MusicToggleButton } from "@/components/v1/skiper25";
import Contact from "@/components/Contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { skillsData } from "@/data/skills";
import { ArrowUpRight, Download, ExternalLink, Github, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { VscHome, VscMail, VscProject, VscTools } from "react-icons/vsc";
import { GitHubCalendar } from "react-github-calendar";
import "react-activity-calendar/tooltips.css";
const resumeUrl = "https://drive.google.com/file/d/1BFtd5D_cyTth3ObU1gcnsJv-lVAPNX3z/view?usp=sharing";

const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/connectharsh1/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com/HarshKochar9008", icon: Github, label: "GitHub" },
  { href: "https://twitter.com/Too_harshk", icon: Twitter, label: "Twitter" },
] as const;

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SKILL_CATEGORY_STYLES: Record<
  string,
  {
    description: string;
    gridClassName: string;
    panelClassName: string;
    iconClassName: string;
    chipClassName: string;
  }
> = {
  Frontend: {
    description: "Interfaces, design systems, and polished user experiences.",
    gridClassName: "md:col-span-2 xl:col-span-2",
    panelClassName:
      "from-cyan-500/12 via-sky-500/6 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "bg-cyan-500/12 text-cyan-200 ring-1 shadow-xl ring-cyan-400/20",
    chipClassName: "border-cyan-400/15 bg-cyan-500/10 text-cyan-50",
  },
  Backend: {
    description: "APIs, services, and scalable application logic.",
    gridClassName: "xl:col-span-2",
    panelClassName:
      "from-violet-500/12 via-fuchsia-500/6 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "bg-violet-500/12 text-violet-200 ring-1 ring-violet-400/20",
    chipClassName: "border-violet-400/15 bg-violet-500/10 text-violet-50",
  },
  Database: {
    description: "Reliable data storage, querying, and persistence layers.",
    gridClassName: "",
    panelClassName:
      "from-emerald-500/12 via-lime-500/6 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "bg-emerald-500/12 text-emerald-200 ring-1 ring-emerald-400/20",
    chipClassName: "border-emerald-400/15 bg-emerald-500/10 text-emerald-50",
  },
  DevOps: {
    description: "Deployment pipelines, containers, and infrastructure tooling.",
    gridClassName: "",
    panelClassName:
      "from-amber-500/12 via-orange-500/6 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "bg-amber-500/12 text-amber-200 ring-1 ring-amber-400/20",
    chipClassName: "border-amber-400/15 bg-amber-500/10 text-amber-50",
  },
  Tools: {
    description: "The everyday stack I use to ship, debug, and collaborate.",
    gridClassName: "md:col-span-2 xl:col-span-2",
    panelClassName:
      "from-rose-500/12 via-pink-500/6 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    iconClassName: "bg-rose-500/12 text-rose-200 ring-1 ring-rose-400/20",
    chipClassName: "border-rose-400/15 bg-rose-500/10 text-rose-50",
  },
};

const IndexReal = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; clientX: number; clientY: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoveredProject = projects.find((project) => project.id === hoveredProjectId) ?? null;

  const handleDragStart = (clientX: number, clientY: number) => {
    dragRef.current = { startX: pos.x, startY: pos.y, clientX, clientY };
    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    setPos({
      x: dragRef.current.startX + clientX - dragRef.current.clientX,
      y: dragRef.current.startY + clientY - dragRef.current.clientY,
    });
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";
  };

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      handleDragMove(e.clientX, e.clientY);
    };
    const onEnd = () => handleDragEnd();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      document.body.style.userSelect = "";
      document.body.style.touchAction = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_bottom,rgba(6, 95, 238, 0.89),transparent_60%)]" />
      <div
        className={`pointer-events-none fixed inset-0 z-40 hidden transition-opacity duration-300 sm:block ${
          hoveredProject ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        {hoveredProject && (
          <img
            src={hoveredProject.image}
            alt={`${hoveredProject.title} full preview`}
            className="absolute inset-0 h-full w-full rounded-[28px] object-contain p-6"
          />
        )}
      </div>
      
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pb-12 sm:pt-20">
        <section id="home" className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 text-center lg:text-left">
            <h1 className="text-4xl font-semibold tracking-tight pt-4 sm:text-6xl">
              Harsh Kochar
            </h1>
            <p className="mt-2 text-sm text-neutral-300 sm:text-base font-italic text-blue-400 ">
            Open to FTE :)
            </p>
          </div>

          <div className="relative flex w-full shrink-0 items-center justify-center pt-2 lg:h-[280px] lg:w-[420px] lg:pt-0">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="h-40 w-40 overflow-hidden rounded-full bg-blue-700 ring-3 ring-white/20 sm:h-56 sm:w-56">
                <img src="/avatar.png" alt="Harsh Kochar" className="h-full w-full object-cover object-top" />
              </div>
            </div>
            <div
              ref={cardRef}
              role="presentation"
              className="group relative w-full max-w-[300px] select-none overflow-hidden rounded-[24px] shadow-4xl shadow-black/30 backdrop-blur-xl active:cursor-grabbing sm:min-w-[340px] sm:max-w-none sm:w-[380px] sm:rounded-3xl"
              style={{
                transform: isMobile
                  ? `translate3d(${pos.x}px, ${pos.y}px, 0) skew(-8deg, 4deg) rotate(9deg)`
                  : `translate(${pos.x}px, ${pos.y}px) skew(-21deg, 20deg) rotate(10deg) rotateX(50deg) rotateY(-13deg)`,
                transformStyle: "preserve-3d",
                boxShadow: "0 25px 50px -12px rgba(20, 20, 20, 0.84), 0 0 0 1px rgba(138, 138, 138, 0.88)",
                touchAction: "none",
              }}
              onPointerDown={(e) => {
                const target = e.target as HTMLElement | null;
                if (target?.closest("[data-no-drag], button, a, input, textarea, select")) {
                  return;
                }
                e.preventDefault();
                cardRef.current?.setPointerCapture?.(e.pointerId);
                handleDragStart(e.clientX, e.clientY);
              }}
            >
              <div className="absolute inset-0 bg-blue-500/10 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col gap-3 p-4 sm:gap-6 sm:p-8">
                <div className="flex items-start gap-2.5 sm:gap-4">
                  <img src="/Logo.png" alt="Harsh Kochar" className="h-8 w-auto shrink-0 overflow-hidden sm:h-auto" />
                  <div className="min-w-0">

                    <h2 className="text-lg font-bold text-white sm:text-2xl">
                      Harsh Kochar
                    </h2>
                    <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                      Full-Stack Developer
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-3 sm:space-y-3 sm:pt-4">
                <div className="mt-2 flex items-center gap-2.5 sm:mt-4 sm:gap-3">
                  <MusicToggleButton soundUrl={fein} />
                  <span className="text-xs text-white/70">Live</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-white/70 sm:h-4 sm:w-4" />
                    <a
                      href="tel:+917030649008"
                      className="break-all text-white/90 underline-offset-2 hover:underline sm:break-normal"
                    >
                      +91 7030649008
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-white/70 sm:h-4 sm:w-4" />
                    <a
                      href="mailto:harshkochar88@gmail.com"
                      className="break-all text-white/90 underline-offset-2 hover:underline sm:break-normal"
                    >
                      harshkochar88@gmail.com
                    </a>
                  </div>
                </div>

                <div className="relative left-0 z-50 flex flex-wrap gap-1 border-t border-white/10 bg-transparent pt-3 sm:gap-2 sm:p-2 sm:pt-4">
                  {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20 hover:text-white sm:h-6 sm:w-6"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-5 sm:mt-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">About</h2>
          <ul className="mt-3 space-y-3.5 text-sm text-neutral-300 sm:text-base">
            <li>
              - Full-Stack Developer focused on Web3, AI systems, and scalable web
              applications.
            </li>
            <li>
              - I build production-ready apps, smart contracts, and automation tools
              using modern technologies.
            </li>
            <li>
              - Passionate about experimenting with AI agents, blockchain
              infrastructure, and developer tools.
            </li>
            <li>
              - Currently building projects like on-chain verification systems, AI
              assistants, and automation dashboards.
            </li>
          </ul>
        </section>
        <section id="projects" className="mt-5 sm:mt-5">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Work Experience
            </h2>
            <p className="text-xs text-neutral-400 sm:text-sm">My Work</p>
          </div>

          <div className="mt-4 space-y-3 sm:mt-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur sm:px-5"

              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="relative h-16 w-auto shrink-0 overflow-hidden rounded-2xl  sm:h-20 sm:w-20">
                      <img
                        src={p.logo}
                        alt={`${p.title} logo`}
                        className="h-full w-full object-cover transition-opacity duration-300 "
                        loading="lazy"
                      />
                      {/* <img
                        src={p.image}
                        alt={`${p.title} preview`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        loading="lazy"
                      /> */}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold sm:text-lg">
                        {p.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                      {p.techStack.map((t) => (
                        <Badge
                          key={t}
                          className="bg-white/5 text-neutral-200 hover:bg-white/10"
                        >
                          {t}
                        </Badge>
                      ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                    <Button
                      asChild
                      className="h-12 w-12 rounded-full border border-white/10 bg-white/5"
                      aria-label="Open GitHub"
                    >
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-8 w-8 text-white/90" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-12 w-12 rounded-full border border-white/10 bg-white/5"
                      aria-label="Open live demo"
                    >
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-8 w-8 text-white/90" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="resume" className="mt-5 sm:mt-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Education
            </h2>
            <p className="text-xs text-neutral-400 sm:text-sm">Document</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-blue-500/12 via-white/[0.04] to-transparent p-[1px] shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
            <div className="relative rounded-[27px] border border-white/5 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-blue-200">
                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(216, 233, 255, 0.9)]" />
                    Resume
                  </div>
                  <p className="mt-3 text-base font-medium text-white sm:text-lg">
                    View my latest resume in a polished one-click preview.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <Button
                    asChild
                    className="group h-auto rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-4 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.09]"
                  >
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                          <Download className="h-4.5 w-4.5 text-white/85" />
                        </span>
                        <span className="flex flex-col items-start">
                          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                            Open Resume
                          </span>

                        </span>
                        <ArrowUpRight className="ml-2 h-4.5 w-4.5 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/90" />
                      </span>
                    </a>
                  </Button>

                  <span className="text-xs text-neutral-400">
                    Open the document in a new tab.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="mt-5 sm:mt-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Skills</h2>
              <p className="mt-2 text-sm text-neutral-300 sm:text-base">
                Skills & Technologies
              </p>
            </div>


          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
            {skillsData.map((cat) => {
              const CategoryIcon = cat.categoryIcon;
              const categoryStyle = SKILL_CATEGORY_STYLES[cat.category] ?? {
                description: "Core technologies I use across projects.",
                gridClassName: "",
                panelClassName:
                  "from-white/8 via-white/[0.03] to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
                iconClassName: "bg-white/5 text-neutral-100 ring-1 ring-white/10",
                chipClassName: "border-white/10 bg-white/5 text-neutral-200",
              };

              return (
                <div
                  key={cat.category}
                  className={categoryStyle.gridClassName}
                >
                  <div
                    className={`group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${categoryStyle.panelClassName} p-5 backdrop-blur transition-transform duration-300 hover:-translate-y-1 sm:p-6`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%)] opacity-60" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="space-y-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${categoryStyle.iconClassName}`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold sm:text-lg">{cat.category}</h3>

                        </div>
                      </div>

                      <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-neutral-300">
                        {cat.items.length} tools
                      </div>
                    </div>

                    <div className="relative mt-8 flex flex-wrap gap-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <span
                            key={item.name}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${categoryStyle.chipClassName}`}
                          >
                            <Icon className="h-4 w-4" style={{ color: item.color }} />
                            {item.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-5 sm:mt-7">
          <Contact />
        </div>
        <section id="contributions" className="mt-5 sm:mt-7">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Contributions
            </h2>
            <a
              href="https://github.com/HarshKochar9008"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-blue-400 transition-colors sm:text-sm flex items-center gap-1"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
          <p className="mt-3 text-sm text-neutral-300 sm:text-base">
            My coding activity over the past year
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur sm:mt-6 sm:p-6">
            <GitHubCalendar 
              username="HarshKochar9008"
              blockSize={isMobile ? 8 : 10}
              blockMargin={isMobile ? 3 : 5}
              blockRadius={isMobile ? 6 : 10}
              year="last"
            />
          </div>
        </section>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        <div className="flex w-full items-center justify-between gap-1 rounded-2xl border border-white/10 bg-black/50 px-2 py-2 shadow-xl backdrop-blur sm:w-auto sm:justify-center sm:gap-2">
          <button
            onClick={() => scrollToSection("home")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-neutral-100 hover:bg-white/10 sm:h-10 sm:w-10"
            aria-label="Home"
          >
            <VscHome size={18} />
          </button>

          <button
            onClick={() => scrollToSection("projects")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-neutral-100 hover:bg-white/10 sm:h-10 sm:w-10"
            aria-label="Projects"
          >
            <VscProject size={18} />
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-neutral-100 hover:bg-white/10 sm:h-10 sm:w-10"
            aria-label="Skills"
          >
            <VscTools size={18} />
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-neutral-100 hover:bg-white/10 sm:h-10 sm:w-10"
            aria-label="Contact"
          >
            <VscMail size={18} />
          </button>
          <button
            onClick={() => scrollToSection("contributions")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-neutral-100 hover:bg-white/10 sm:h-10 sm:w-10"
            aria-label="Contributions"
          >
            <Github size={18} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default IndexReal;

