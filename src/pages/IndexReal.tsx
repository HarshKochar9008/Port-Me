import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/components/ProjectCard";
import fein from "@/soothing.mp3";
import { MusicToggleButton } from "@/components/v1/skiper25";
import ContactReal from "@/components/ContactReal";
import CodingHabits from "@/components/CodingHabits";
import { Badge } from "@/components/ui/badge";
import { skillsData } from "@/data/skills";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Move,
  Twitter,
} from "lucide-react";
import { VscHome, VscMail, VscProject, VscTools } from "react-icons/vsc";
import { GitHubCalendar } from "react-github-calendar";
import "react-activity-calendar/tooltips.css";

const resumeUrl =
  "https://drive.google.com/file/d/1BFtd5D_cyTth3ObU1gcnsJv-lVAPNX3z/view?usp=sharing";

const SOCIAL_LINKS = [
  { href: "https://github.com/HarshKochar9008", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/connectharsh1/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/Too_harshk", icon: Twitter, label: "Twitter" },
] as const;

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const GH_USER = "HarshKochar9008";

/* Same endpoint react-github-calendar fetches from. Asked directly so the
   Contributions section can be left out of the page entirely when it would have
   nothing to draw — see hasContributions below. */
const GH_CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`;

/* Bottom dock. Ids match the sections below and drive the active pill. */
const NAV_ITEMS = [
  { id: "home", icon: VscHome, label: "Home" },
  { id: "projects", icon: VscProject, label: "Projects" },
  { id: "skills", icon: VscTools, label: "Skills" },
  { id: "contact", icon: VscMail, label: "Contact" },
  { id: "contributions", icon: Github, label: "GitHub" },
] as const;

const SKILL_CATEGORY_STYLES: Record<
  string,
  { panelClassName: string; iconClassName: string; chipClassName: string }
> = {
  Frontend: {
    panelClassName: "from-cyan-500/[0.12] via-sky-500/[0.06] to-transparent",
    iconClassName: "bg-cyan-500/[0.12] text-cyan-200 ring-1 ring-cyan-400/20",
    chipClassName: "border-cyan-400/15 bg-cyan-500/10 text-cyan-50",
  },
  Backend: {
    panelClassName: "from-violet-500/[0.12] via-fuchsia-500/[0.06] to-transparent",
    iconClassName: "bg-violet-500/[0.12] text-violet-200 ring-1 ring-violet-400/20",
    chipClassName: "border-violet-400/15 bg-violet-500/10 text-violet-50",
  },
  Database: {
    panelClassName: "from-emerald-500/[0.12] via-lime-500/[0.06] to-transparent",
    iconClassName: "bg-emerald-500/[0.12] text-emerald-200 ring-1 ring-emerald-400/20",
    chipClassName: "border-emerald-400/15 bg-emerald-500/10 text-emerald-50",
  },
  DevOps: {
    panelClassName: "from-amber-500/[0.12] via-orange-500/[0.06] to-transparent",
    iconClassName: "bg-amber-500/[0.12] text-amber-200 ring-1 ring-amber-400/20",
    chipClassName: "border-amber-400/15 bg-amber-500/10 text-amber-50",
  },
  Tools: {
    panelClassName: "from-rose-500/[0.12] via-pink-500/[0.06] to-transparent",
    iconClassName: "bg-rose-500/[0.12] text-rose-200 ring-1 ring-rose-400/20",
    chipClassName: "border-rose-400/15 bg-rose-500/10 text-rose-50",
  },
};

const FALLBACK_SKILL_STYLE = {
  panelClassName: "from-white/[0.08] via-white/[0.03] to-transparent",
  iconClassName: "bg-white/5 text-neutral-100 ring-1 ring-white/10",
  chipClassName: "border-white/10 bg-white/5 text-neutral-200",
};

/* Reusable section header: heading left, quiet uppercase label right, hairline
   underneath. `.hk-head` lives in index.css — see the note there about the
   legacy `section > h2` rule this has to out-specify. */
const SectionHead = ({ title, label }: { title: string; label: string }) => (
  <div className="hk-head">
    <h2 className="text-xl font-semibold tracking-tight text-neutral-50 sm:text-2xl">{title}</h2>
    <p className="hk-head-label">{label}</p>
  </div>
);

const IndexReal = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [active, setActive] = useState<string>("home");
  /* The contributions API returns 0 for this account, which rendered a full
     year of empty squares under the words "My coding activity" — a worse
     signal than showing nothing. Stays false until real data arrives. */
  const [hasContributions, setHasContributions] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; clientX: number; clientY: number } | null>(
    null
  );
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* The GitHub entry only earns a slot once there's a graph to scroll to. */
  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.id !== "contributions" || hasContributions),
    [hasContributions]
  );

  const handleDragStart = (clientX: number, clientY: number) => {
    dragRef.current = { startX: pos.x, startY: pos.y, clientX, clientY };
    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";
  };

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    setPos({
      x: dragRef.current.startX + clientX - dragRef.current.clientX,
      y: dragRef.current.startY + clientY - dragRef.current.clientY,
    });
    setHasDragged(true);
  }, []);

  const handleDragEnd = () => {
    dragRef.current = null;
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";
  };

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 640);

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
  }, [handleDragMove]);

  /* Does this account actually have a public contribution graph? At the time of
     writing the API answers 0 for the whole year, which the calendar rendered as
     365 blank squares under the caption "My coding activity over the past year"
     — an emptier statement than saying nothing. Asked once, up front, so the
     section and its dock entry can both be dropped rather than hidden. */
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(GH_CONTRIB_API, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.total?.lastYear > 0) setHasContributions(true);
      })
      .catch(() => {
        // Offline, rate-limited or aborted — the section just stays out.
      });
    return () => ctrl.abort();
  }, []);

  /* Active-section tracking for the dock. The dock had no current-position
     indicator at all before, so five identical buttons gave no sense of where
     you were on a five-screen page.

     rootMargin pulls the detection band to roughly the upper third of the
     viewport: without it, whichever section merely touches the bottom edge
     wins, and the dock highlights the section you're scrolling toward rather
     than the one you're reading. */
  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [navItems]);

  return (
    <div className="hk-real min-h-screen bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(29,78,216,0.28),transparent_65%)]" />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-32 pt-12 sm:px-6 sm:pb-28 sm:pt-20">
        {/* `.hk-flow` sets one gap between every section. Before this, spacing
            came from per-section mt-5 classes plus a legacy `margin-bottom:
            10rem` on #resume and #skills, which put 160px voids in two places
            and 20px everywhere else. */}
        <div className="hk-flow">
          {/* ══ Hero ══ */}
          <section id="home" className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 max-w-xl text-center lg:text-left">
              <h1 className="font-['Space_Grotesk'] text-4xl font-medium tracking-[-0.04em] text-white sm:text-6xl">
                Harsh Kochar
              </h1>

              <p className="mt-3 text-base text-neutral-300 sm:text-lg">
                Full-stack developer building{" "}
                <span className="text-white">Web3</span>,{" "}
                <span className="text-white">AI systems</span>, and production web apps.
              </p>

              {/* Two actions, nothing trailing them. The social icons that used
                  to sit alongside are still on the card and in the footer. */}
              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-neutral-200"
                >
                  View projects
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </button>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
                >
                  <FileText className="h-4 w-4" aria-hidden />
                  Resume
                </a>
              </div>
            </div>

            {/* ── The card ── */}
            <div className="relative flex w-full shrink-0 items-center justify-center pt-2 lg:h-[300px] lg:w-[420px] lg:pt-0">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className="h-40 w-40 overflow-hidden rounded-full bg-blue-700 ring-2 ring-white/20 sm:h-56 sm:w-56">
                  <img src="/avatar.png" alt="" className="h-full w-full object-cover object-top" />
                </div>
              </div>

              <div
                ref={cardRef}
                role="presentation"
                className="group relative w-full max-w-[300px] cursor-grab select-none overflow-hidden rounded-[24px] backdrop-blur-xl active:cursor-grabbing sm:w-[380px] sm:min-w-[340px] sm:max-w-none sm:rounded-3xl"
                style={{
                  transform: isMobile
                    ? `translate3d(${pos.x}px, ${pos.y}px, 0) skew(-8deg, 4deg) rotate(9deg)`
                    : `translate(${pos.x}px, ${pos.y}px) skew(-21deg, 20deg) rotate(10deg) rotateX(50deg) rotateY(-13deg)`,
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 25px 50px -12px rgba(20, 20, 20, 0.84), 0 0 0 1px rgba(138, 138, 138, 0.88)",
                  touchAction: "none",
                }}
                onPointerDown={(e) => {
                  const target = e.target as HTMLElement | null;
                  if (target?.closest("[data-no-drag], button, a, input, textarea, select")) return;
                  e.preventDefault();
                  cardRef.current?.setPointerCapture?.(e.pointerId);
                  handleDragStart(e.clientX, e.clientY);
                }}
              >
                <div className="absolute inset-0 bg-blue-500/10 transition-colors duration-300" />
                <div className="relative z-10 flex flex-col gap-3 p-4 sm:gap-6 sm:p-8">
                  <div className="flex items-start gap-2.5 sm:gap-4">
                    <img src="/Logo.png" alt="" className="h-8 w-auto shrink-0 sm:h-10" />
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white sm:text-2xl">Harsh Kochar</h2>
                      <p className="mt-0.5 text-xs text-white/80 sm:text-sm">Full-Stack Developer</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-white/10 pt-3 sm:space-y-3 sm:pt-4">
                    <div className="mt-2 flex items-center gap-2.5 sm:mt-4 sm:gap-3">
                      <MusicToggleButton soundUrl={fein} />
                      <span className="text-xs text-white/70">Live</span>
                    </div>
                    {/* Phone deliberately not on the card — email is the only
                        direct channel published on the page. */}
                    <div className="flex items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-white/70 sm:h-4 sm:w-4" aria-hidden />
                      <a
                        href="mailto:harshkochar88@gmail.com"
                        className="break-all text-white/90 underline-offset-2 hover:underline sm:break-normal"
                      >
                        harshkochar88@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="relative z-50 flex flex-wrap items-center gap-1 border-t border-white/10 pt-3 sm:gap-2 sm:pt-4">
                    {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20 hover:text-white"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                      </a>
                    ))}

                    {/* The card has been draggable all along with nothing to say
                        so. Sits on the card rather than under it, so it reads as
                        printed on the stock and inherits the same skew. Not in
                        the pointerdown handler's ignore list, so starting a drag
                        on the text still drags. */}
                    <span
                      className="pointer-events-none ml-auto flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white opacity-70 sm:text-[11px]"
                      aria-hidden
                    >
                      <Move className="h-3 w-3" />
                      Drag
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ About ══ */}
          <section id="about">
            <SectionHead title="About" label="Who I am" />
            {/* The bullets used to be literal "- " characters inside <li>, which
                screen readers read out as hyphens. Real markers instead. */}
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-sm leading-relaxed text-neutral-300 sm:text-base md:grid-cols-2">
              {[
                "Full-Stack Developer focused on Web3, AI systems, and scalable web applications.",
                "I build production-ready apps, smart contracts, and automation tools using modern technologies.",
                "Passionate about experimenting with AI agents, blockchain infrastructure, and developer tools.",
                "Currently building on-chain verification systems, AI assistants, and automation dashboards.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-blue-400" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <CodingHabits />

          {/* ══ Projects ══ */}
          <section id="projects">
            <SectionHead title="Project Experience" label="My work" />

            <div className="mt-6 space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.05] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      {/* Fixed square box. The old `h-16 w-auto sm:h-20 sm:w-20`
                          gave each logo a different width below sm — one tall
                          sliver, one wide banner — because w-auto let the
                          intrinsic ratio decide.

                          object-contain, not cover: these are brand marks at
                          three different aspect ratios, and cover was cropping
                          the wide ones through the middle of the wordmark. */}
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-1.5 sm:h-16 sm:w-16">
                        <img
                          src={p.logo}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-neutral-50 sm:text-lg">
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                          >
                            {p.title}
                          </a>
                        </h3>
                        {p.blurb && (
                          <p className="mt-1 text-sm text-neutral-400">{p.blurb}</p>
                        )}
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {p.techStack.map((t) => (
                            <Badge
                              key={t}
                              className="border-white/5 bg-white/[0.06] text-[11px] font-normal text-neutral-300 hover:bg-white/10"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Were h-12 buttons holding h-8 icons — the glyph filled the
                        circle edge to edge. 40px box, 16px icon. */}
                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                        aria-label={`${p.title} source on GitHub`}
                      >
                        <Github className="h-4 w-4" aria-hidden />
                      </a>
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                        aria-label={`${p.title} live demo`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ Resume ══
              Was headed "Education" with no education content in it — the panel
              is a link to a resume PDF, so it says that now. */}
          <section id="resume">
            <SectionHead title="Resume" label="Document" />

            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-blue-500/[0.12] via-white/[0.04] to-transparent">
              <div className="relative p-6 sm:p-7">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_45%)]"
                  aria-hidden
                />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-md">
                    <p className="text-base font-medium text-white sm:text-lg">
                      The full history — roles, education and stack.
                    </p>
                    <p className="mt-1.5 text-sm text-neutral-400">Opens in a new tab.</p>
                  </div>

                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.1]"
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    Open Resume
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ══ Skills ══ */}
          <section id="skills">
            <SectionHead title="Skills" label="Technologies" />

            {/* Five cards over a 6-column grid: three at 2 columns, then two at
                3. Both rows come out flush. The old 4-column grid with two
                double-width cards left the second row ragged and an empty
                column hanging off the right edge. */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
              {skillsData.map((cat, i) => {
                const CategoryIcon = cat.categoryIcon;
                const style = SKILL_CATEGORY_STYLES[cat.category] ?? FALLBACK_SKILL_STYLE;
                const span = i < 3 ? "lg:col-span-2" : "lg:col-span-3";

                return (
                  <div
                    key={cat.category}
                    className={`group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${style.panelClassName} ${span} p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6`}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]"
                      aria-hidden
                    />

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconClassName}`}
                        >
                          <CategoryIcon className="h-4 w-4" aria-hidden />
                        </div>
                        <h3 className="text-base font-semibold text-neutral-50">{cat.category}</h3>
                      </div>

                      <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                        {cat.items.length}
                      </span>
                    </div>

                    <div className="relative mt-5 flex flex-wrap gap-1.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <span
                            key={item.name}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${style.chipClassName}`}
                          >
                            <Icon className="h-3.5 w-3.5" style={{ color: item.color }} aria-hidden />
                            {item.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <ContactReal />

          {/* ══ Contributions ══
              Left out of the DOM entirely unless the graph has something in it,
              so an account with no public contributions doesn't publish a year
              of blank squares captioned "My coding activity over the past year".
              Restores itself the moment the API reports activity. */}
          {hasContributions && (
            <section id="contributions">
              <SectionHead title="Contributions" label="GitHub" />
              <p className="mt-4 text-sm text-neutral-400">My coding activity over the past year</p>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                <GitHubCalendar
                  username={GH_USER}
                  blockSize={isMobile ? 8 : 10}
                  blockMargin={isMobile ? 3 : 5}
                  blockRadius={isMobile ? 6 : 10}
                  year="last"
                />
              </div>
            </section>
          )}
        </div>

        {/* ══ Footer ══ */}
        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-white/[0.08] pt-8 text-center sm:mt-24 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-neutral-500">
            Built by Harsh Kochar · React, TypeScript, Tailwind
          </p>
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label={label}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </a>
            ))}
          </div>
        </footer>
      </main>

      {/* ══ Dock ══
          Five identical unlabelled buttons before this: no current-section
          indicator and no way to tell them apart except by icon. Now the active
          one is filled and named, and the rest reveal their label on hover. */}
      <nav
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
        aria-label="Section navigation"
      >
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/70 p-1.5 shadow-2xl backdrop-blur-xl">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex h-10 items-center justify-center gap-2 rounded-xl px-3 transition-all duration-300 ${
                  isActive
                    ? "bg-white text-neutral-950"
                    : "text-neutral-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon size={17} aria-hidden />
                {/* The label rides along only for the active item, so the dock
                    stays compact but never anonymous. */}
                <span
                  className={`overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                    isActive ? "max-w-24 opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default IndexReal;
