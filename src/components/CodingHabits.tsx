import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LayoutGrid, Minimize2, MoveHorizontal, Shuffle } from "lucide-react";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiDart,
  SiEthereum,
  SiFlutter,
  SiGithub,
  SiLinkedin,
  SiMongodb,
  SiNodedotjs,
  SiOpenai,
  SiSolidity,
  SiTypescript,
  SiVercel,
  SiX,
} from "react-icons/si";
import { projects } from "@/components/ProjectCard";
import "./CodingHabits.css";

/* ─────────────────────────────────────────────────────────────
   Dithered stamp art
   -----------------------------------------------------------
   A Bayer-4 ordered-dither pipeline. Rather than shipping
   pre-rendered PNGs, each card's scene is generated procedurally
   from its seed and then dithered to two levels — ink, or nothing
   at all — so the art is deterministic, offline, and weighs nothing.
   ───────────────────────────────────────────────────────────── */

// prettier-ignore
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// On a dark page the sky becomes transparent (the card's glass shows through)
// and the landform is drawn in light. Ink is the portfolio's blue-400 accent so
// the art belongs to the rest of the page.
const INK: readonly [number, number, number] = [96, 165, 250]; // #60A5FA

// Canvas resolution for the art block. Both sizes keep the 220:138 CSS aspect
// ratio; the browser scales them up with `image-rendering: pixelated`, which is
// what gives the chunky dither its bite.
//
// Two sizes because the two layouts read the art at very different scales: the
// deck's single card shows it ~300px wide, the expanded fan shows fifteen of
// them at ~190px. Rendering the fan at deck resolution would mean ~2.2M scene
// samples on the frame the fan opens, which is enough to be felt.
const ART = {
  deck: { w: 240, h: 151 },
  fan: { w: 132, h: 83 },
} as const;

const CONTRAST = 1.15;
const GAMMA = 1.0;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Deterministic 32-bit PRNG so every seed always paints the same scene. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Paints a luminance field for a landscape: a lit sky, three or four
 * receding ridge lines, and optionally water across the bottom.
 * 1 = fully lit (drops out to transparent), 0 = ink.
 */
function renderScene(w: number, h: number, seed: number): Float32Array {
  const rnd = mulberry32(seed);
  const lum = new Float32Array(w * h);

  // Per-card exposure, so the set holds both bright and moody frames.
  const exposure = 0.86 + rnd() * 0.3;

  const sunX = 0.15 + rnd() * 0.7;
  const sunY = 0.08 + rnd() * 0.2;
  const sunR = 0.25 + rnd() * 0.3;

  const layerCount = 3 + Math.floor(rnd() * 2);
  const layers = Array.from({ length: layerCount }, (_, i) => {
    const t = i / Math.max(1, layerCount - 1);
    return {
      base: 0.4 + t * 0.3 + rnd() * 0.07, // ridge line, 0 = top
      amp: 0.2 - t * 0.08 + rnd() * 0.05, // how jagged it is
      f1: 1.1 + rnd() * 2,
      f2: 2.4 + rnd() * 3.6,
      f3: 5.5 + rnd() * 6,
      p1: rnd() * Math.PI * 2,
      p2: rnd() * Math.PI * 2,
      p3: rnd() * Math.PI * 2,
      // Distant layers stay hazy and pale; near ones fall to near-solid ink.
      body: 0.78 - t * 0.66,
    };
  });

  const hasWater = rnd() > 0.55;
  const waterY = 0.78 + rnd() * 0.09;

  for (let y = 0; y < h; y++) {
    const v = y / Math.max(1, h - 1);
    for (let x = 0; x < w; x++) {
      const u = x / Math.max(1, w - 1);

      // Sky: vertical falloff plus a soft glow around the light source.
      const dx = u - sunX;
      const dy = v - sunY;
      const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / sunR);
      let l = 0.99 - v * 0.22 + glow * glow * 0.3;

      // Ridges, back to front — each one overwrites whatever sits behind it.
      // No haze bleed at the ridge line, so the silhouette stays crisp.
      for (const g of layers) {
        const ridge =
          g.base -
          g.amp *
            (0.55 * Math.sin(u * g.f1 * Math.PI + g.p1) +
              0.3 * Math.sin(u * g.f2 * Math.PI + g.p2) +
              0.15 * Math.sin(u * g.f3 * Math.PI + g.p3));
        if (v > ridge) {
          const depth = Math.min(1, (v - ridge) / 0.45);
          const face = 0.5 + 0.5 * Math.sin(u * g.f2 * Math.PI + g.p2 + 1.6);
          l = g.body + face * 0.16 - depth * 0.14;
        }
      }

      // Water: soft reflected streaks, brightest right below the shoreline.
      if (hasWater && v > waterY) {
        const streak = Math.sin((v - waterY) * 26 + Math.sin(u * 5) * 0.8);
        l = 0.52 + streak * 0.14 + (1 - Math.min(1, (v - waterY) / 0.2)) * 0.15;
      }

      // Vignette + a little grain so flat regions still break into texture.
      l *= exposure;
      l -= ((u - 0.5) ** 2 + (v - 0.5) ** 2) * 0.16;
      l += (rnd() - 0.5) * 0.02;

      lum[y * w + x] = clamp01(l);
    }
  }

  return lum;
}

/** Bayer-4 ordered dither down to two levels: ink, or fully transparent. */
function ditherInto(out: Uint8ClampedArray, lum: Float32Array, w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = y * w + x;
      let v = (lum[j] - 0.5) * CONTRAST + 0.5;
      v = Math.pow(clamp01(v), GAMMA);
      const threshold = (BAYER4[y & 3][x & 3] + 0.5) / 16;
      if (v >= threshold) continue; // stays transparent — createImageData is zeroed
      const i = j * 4;
      out[i] = INK[0];
      out[i + 1] = INK[1];
      out[i + 2] = INK[2];
      out[i + 3] = 255;
    }
  }
}

const DitherArt = ({ seed, size = "deck" }: { seed: number; size?: keyof typeof ART }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { w, h } = ART[size];

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = w;
    canvas.height = h;
    const frame = ctx.createImageData(w, h);
    ditherInto(frame.data, renderScene(w, h, seed), w, h);
    ctx.putImageData(frame, 0, 0);
  }, [seed, w, h]);

  return <canvas ref={ref} className="hk-art" width={w} height={h} aria-hidden />;
};

/* ─────────────────────────────────────────────────────────────
   Content
   ───────────────────────────────────────────────────────────── */

const byTitle = (title: string) => projects.find((p) => p.title.trim() === title);

/* The build-in-public thread behind the miniGo cards. Share/tracking params are
   stripped so the link doesn't rot and doesn't leak a referral trail. */
const MINIGO_POST =
  "https://www.linkedin.com/posts/connectharsh1_buildinginpublic-flutter-mobileapp-activity-7457665994522525696-4TSD";

interface HabitCard {
  q: string;
  title: string;
  detail: string;
  seed: number;
  href?: string;
  /* Label for the link chip, so it says where it goes rather than "open". */
  hrefLabel?: string;
  /* Brand mark stamped in the card's header band. Only on cards where a single
     logo genuinely stands for the answer — left off the rest so the deck
     doesn't read as a logo carousel. Colours are nudged brighter than the
     official brand values where those go muddy against dark glass. */
  logo?: { icon: IconType; color: string };
}

const HABIT_CARDS: HabitCard[] = [
  {
    q: "Where does a project start?",
    title: "With something that annoyed me",
    detail: "Bluetooth dropped it. WhatsApp compressed it. So I built miniGo.",
    seed: 1022,
  },
  {
    q: "How do you work on it?",
    title: "In public, mistakes included",
    detail: "The wins, the misses, and the things I had to learn twice.",
    seed: 1016,
    href: "https://www.linkedin.com/in/connectharsh1/",
    hrefLabel: "LinkedIn",
    logo: { icon: SiLinkedin, color: "#4DA3E0" },
  },
  {
    q: "Where does the backend live?",
    title: "Node and Express",
    detail: "REST APIs with MongoDB or PostgreSQL behind them. Wince runs Express.",
    seed: 1036,
    href: byTitle("Wince Scheduler")?.demoUrl,
    hrefLabel: "Wince",
    logo: { icon: SiNodedotjs, color: "#5FBF5F" },
  },
  {
    /* Points at the repo, not the demo — the MERN card already links ApexFlow's
       live site, so this one sends you to the contracts instead of repeating it. */
    q: "What are you building now?",
    title: "Web3 and AI agents",
    detail: "On-chain verification and agentic tooling — contracts you can read.",
    seed: 1019,
    href: byTitle("ApexFlow Token")?.githubUrl,
    hrefLabel: "Contracts",
    logo: { icon: SiEthereum, color: "#8A92E3" },
  },
  {
    q: "What's in beta right now?",
    title: "miniGo",
    detail: "Peer-to-peer transfer. A 6-character code or a QR scan, no cloud.",
    seed: 1037,
    href: MINIGO_POST,
    hrefLabel: "The thread",
    logo: { icon: SiFlutter, color: "#54C5F8" },
  },
  {
    q: "Where else do you post?",
    title: "@Too_harshk",
    detail: "On X, thinking out loud while the thing is still being built.",
    seed: 1039,
    href: "https://x.com/Too_harshk",
    hrefLabel: "X",
    logo: { icon: SiX, color: "#FFFFFF" },
  },
  {
    q: "Which database wins?",
    title: "Depends on the job",
    detail: "MongoDB for Gossips, PostgreSQL for Wince. Chosen per project.",
    seed: 1018,
    logo: { icon: SiMongodb, color: "#4DB33D" },
  },
  {
    q: "Only ever the web?",
    title: "Mobile too, in Dart",
    detail: "One Flutter codebase, designed and built end to end, now in beta.",
    seed: 1015,
    logo: { icon: SiDart, color: "#4FC3F7" },
  },
  {
    q: "Where does the code live?",
    title: "@HarshKochar9008",
    detail: "Open source by default — read the commits, not just the screenshots.",
    seed: 1021,
    href: "https://github.com/HarshKochar9008",
    hrefLabel: "GitHub",
    logo: { icon: SiGithub, color: "#E6EDF3" },
  },
  {
    q: "What does the stack top out at?",
    title: "MERN, end to end",
    detail: "ApexFlow Token runs MERN alongside smart contracts and wallet auth.",
    seed: 1041,
    href: byTitle("ApexFlow Token")?.demoUrl,
    hrefLabel: "ApexFlow",
  },
  {
    q: "Do you write contracts too?",
    title: "Yes, on-chain",
    detail: "Solidity work wired into a real product rather than a testnet demo.",
    seed: 1044,
    logo: { icon: SiSolidity, color: "#C6C9D1" },
  },
  {
    q: "What's the newest obsession?",
    title: "Agentic AI",
    detail: "Agents inside shipping software, not stuck in notebooks.",
    seed: 1048,
    logo: { icon: SiOpenai, color: "#E9EBEC" },
  },
  {
    q: "Which languages, in order?",
    title: "TypeScript, then Python",
    detail: "JavaScript when speed matters. Java when the problem asks for it.",
    seed: 1052,
    logo: { icon: SiTypescript, color: "#4C9BE0" },
  },
  {
    q: "How does it get deployed?",
    title: "Push, preview, promote",
    detail: "Vercel for the apps, with Docker and Actions behind them.",
    seed: 1057,
    logo: { icon: SiVercel, color: "#FFFFFF" },
  },
  {
    q: "What's the current status?",
    title: "Open to Freelance",
    detail: "Looking for a team building production software, not prototypes.",
    seed: 1061,
    href: "mailto:harshkochar88@gmail.com",
    hrefLabel: "Email me",
  },
];

/* How long each card holds before the deck advances on its own. */
const DWELL_MS = 6000;

/** Fisher-Yates. */
const shuffled = (list: HabitCard[]) => {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

/* ─────────────────────────────────────────────────────────────
   Shuffle: gather, then deal
   -----------------------------------------------------------
   Every card walks to the middle of the fan and stacks into a pile,
   the array is reordered while they're piled, then they spread back
   out into their new slots along their own random arc.

   Nothing fades, and nothing needs to. --hk-cx / --hk-cy (set in
   cardStyle below) are each card's distance from the centre measured
   *in slot units*, so the gather always ends on the fan's midpoint
   and the spread always starts there — at rotate(0), scale(0.88),
   identically for every card. The pile therefore reads as one card,
   and a card that changes slot at the swap only changes which offset
   it walks back out along, not where it is at that instant. The seam
   lands on a pixel both phases already agree on, so the reorder is
   invisible without hiding anything.

   These mirror the animation durations in CodingHabits.css —
   change them in both places.
   ───────────────────────────────────────────────────────────── */
const STAGGER_MS = 30;
const GATHER_MS = 750;
const SPREAD_MS = 1050;

/* The last card starts latest, so it also finishes latest — both waits key off
   its delay, not the bare durations. ~2.6s door to door. */
const LAST_DELAY = STAGGER_MS * (HABIT_CARDS.length - 1);
const SWAP_AT = GATHER_MS + LAST_DELAY;
const DONE_AT = SWAP_AT + SPREAD_MS + LAST_DELAY;

type Phase = "idle" | "gather" | "spread";

/* Per-card drift and spin for the deal, re-rolled every shuffle so no two cards
   fly the same arc twice. Fed to the keyframes as custom properties. */
const rollScatter = (count: number) =>
  Array.from({ length: count }, () => ({
    dx: Math.round((Math.random() * 2 - 1) * 90),
    spin: Math.round((Math.random() * 2 - 1) * 26),
  }));

/* ─────────────────────────────────────────────────────────────
   The deck
   -----------------------------------------------------------
   One card at a time instead of a fifteen-card fan. The fan had a
   readability problem it couldn't design its way out of: cards
   overlapped by 20% of their own width, so the right-hand fifth of
   every card's body text sat underneath its neighbour and could only
   be read by hovering. One card at full size has no neighbour to hide
   behind, which is the whole reason for the change — the depth cue
   moves to two blank shells stacked behind it.
   ───────────────────────────────────────────────────────────── */

/* The stamp face, shared by the deck's live card, the card peeking out behind it
   and the expanded fan.

   `muted` is for the peeking card: it's decorative (the real one arrives when the
   swipe lands), so it drops the link and the swipe hint. Without that the link
   would still be tab-reachable inside an aria-hidden subtree, which is exactly
   the focusable-but-invisible trap screen readers can't recover from. */
const CardFace = ({
  card,
  size,
  muted = false,
}: {
  card: HabitCard;
  size: keyof typeof ART;
  muted?: boolean;
}) => {
  const Logo = card.logo?.icon;
  return (
    <>
      {/* Header band. Mostly empty on purpose — the three punched holes are cut
          straight out of the card by the mask in the CSS, so this only has to
          reserve the room they sit in, plus anchor the brand mark. */}
      <div className="hk-card-head">
        {Logo && (
          <span className="hk-card-logo" style={{ color: card.logo?.color }} aria-hidden>
            <Logo />
          </span>
        )}
        {/* Deck only. `cursor: grab` says "draggable" on a desktop and nothing
            at all on a phone, so the gesture gets named. Same treatment as the
            hint printed on the hero card, so the two read as one system. */}
        {size === "deck" && !muted && (
          <span className="hk-card-hint" aria-hidden>
            <MoveHorizontal />
            Swipe
          </span>
        )}
      </div>

      <DitherArt seed={card.seed} size={size} />

      <div className="hk-card-body">
        <p className="hk-card-q">{card.q}</p>
        <h3 className="hk-card-title">{card.title}</h3>
        <p className="hk-card-detail">{card.detail}</p>
        {size === "deck" && !muted && card.href && (
          <a
            className="hk-card-link"
            href={card.href}
            target={card.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            {card.hrefLabel ?? "Open"}
            <ArrowUpRight aria-hidden />
          </a>
        )}
      </div>
    </>
  );
};

const CARDS_PER_ROW = 5;

const CodingHabits = () => {
  /* Order is state, not a constant, because shuffle rewrites it — for the deck
     and the fan alike. */
  const [cards, setCards] = useState<HabitCard[]>(HABIT_CARDS);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Collapsed by default: one card, read at full size. Expanded lays all
     fifteen out in the fan — same stamps, all on the table at once. */
  const [expanded, setExpanded] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scatter, setScatter] = useState(() => rollScatter(HABIT_CARDS.length));
  const timers = useRef<number[]>([]);
  /* Which way the last move went, so the incoming card deals in from the side
     the gesture threw the old one toward. */
  const [dir, setDir] = useState<1 | -1>(1);
  /* Autoplay hands over for good the first time a swipe lands — an animation
     the viewer can't stop is a WCAG 2.2.2 problem, and a deliberate swipe is
     them saying they'd rather drive. */
  const [auto, setAuto] = useState(true);
  /* Live horizontal offset of the swipe, in px. 0 when the card is at rest. */
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  /* Suppresses the spring-back transition for the one frame where a completed
     swipe resets the offset — the incoming card's deal animation carries that
     motion instead, and letting both run reads as a double slide. */
  const [instant, setInstant] = useState(false);
  /* Which neighbour is peeking out behind the live card — +1 while you're
     throwing left, -1 while walking right. Held in state with a deadzone rather
     than derived straight from the sign of dx: flipping it re-seeds the peeking
     card's dither canvas, and a wiggle across the centre would otherwise
     recompute the scene on every frame. */
  const [peekDir, setPeekDir] = useState<1 | -1>(1);
  const swipe = useRef<{ id: number; startX: number } | null>(null);
  const count = cards.length;

  const rows = useMemo(() => {
    const out: HabitCard[][] = [];
    for (let i = 0; i < cards.length; i += CARDS_PER_ROW) {
      out.push(cards.slice(i, i + CARDS_PER_ROW));
    }
    return out;
  }, [cards]);

  const step = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setIndex((v) => (v + d + count) % count);
    },
    [count]
  );

  /* ─── Swipe ───
     Drag the card sideways and let go: past the threshold it advances, short of
     it the card springs back. Left throws the card away and brings the next one
     in behind it; right walks back. The offset lives on a wrapper rather than on
     the card itself, because the card carries the deal keyframes and a filled
     animation out-ranks an inline transform — they'd cancel each other. */
  const SWIPE_MIN = 60;
  /* How far you pull before the card behind is fully revealed. Deliberately
     larger than SWIPE_MIN, so at the moment the throw commits the neighbour is
     still visibly on its way in rather than already arrived. */
  const PEEK_FULL = 130;
  const PEEK_DEADZONE = 10;

  const onSwipeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Let the link and any real control keep their clicks.
    if ((e.target as HTMLElement | null)?.closest("a, button")) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    swipe.current = { id: e.pointerId, startX: e.clientX };
    setDragging(true);
  };

  const onSwipeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipe.current?.id !== e.pointerId) return;
    const travelled = e.clientX - swipe.current.startX;
    setDx(travelled);
    // Past the deadzone the intent is clear, so the right neighbour moves in
    // behind. Inside it, whatever was showing stays.
    if (Math.abs(travelled) > PEEK_DEADZONE) setPeekDir(travelled < 0 ? 1 : -1);
  };

  const onSwipeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipe.current?.id !== e.pointerId) return;
    const travelled = e.clientX - swipe.current.startX;
    swipe.current = null;
    setDragging(false);

    if (Math.abs(travelled) >= SWIPE_MIN) {
      setInstant(true);
      setDx(0);
      setAuto(false);
      step(travelled < 0 ? 1 : -1);
      requestAnimationFrame(() => setInstant(false));
    } else {
      setDx(0); // under the threshold — the transition springs it home
    }
  };

  /* A cancel is the browser taking the gesture away (it decided the drag was a
     scroll, the window lost focus, …) — not the viewer completing a throw. So it
     always springs home, however far the card had travelled. */
  const onSwipeCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipe.current?.id !== e.pointerId) return;
    swipe.current = null;
    setDragging(false);
    setDx(0);
  };

  const shuffle = useCallback(() => {
    if (phase !== "idle") return; // one shuffle at a time; re-clicks are no-ops

    // Collapsed, there's a single card on screen and no fan to gather into — the
    // deal animation on the incoming card is the whole transition.
    if (!expanded) {
      setCards((c) => shuffled(c));
      setIndex(0);
      return;
    }

    timers.current = []; // idle means both of the last run's timers have fired
    setScatter(rollScatter(cards.length));
    setPhase("gather");
    timers.current.push(
      window.setTimeout(() => {
        setCards((c) => shuffled(c));
        setIndex(0);
        setPhase("spread");
      }, SWAP_AT),
      window.setTimeout(() => setPhase("idle"), DONE_AT)
    );
  }, [phase, expanded, cards.length]);

  /* Both timeouts outlive a fast unmount otherwise, and fire into a dead tree. */
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  /* Stagger keys off the card's position in the fan, so the pile builds card by
     card rather than every card arriving at once.

     --hk-cx / --hk-cy are the card's signed distance from the centre slot,
     measured in slots: +2 means "two slots left of centre", so walking that many
     steps lands it on the middle. The CSS converts steps to px, which is what
     keeps this correct at every --card-w without measuring the DOM. */
  const cardStyle = (rowIndex: number, colIndex: number): CSSProperties => {
    const i = rowIndex * CARDS_PER_ROW + colIndex;
    return {
      "--hk-cx": `${(CARDS_PER_ROW - 1) / 2 - colIndex}`,
      "--hk-cy": `${(rows.length - 1) / 2 - rowIndex}`,
      "--hk-dx": `${scatter[i]?.dx ?? 0}px`,
      "--hk-spin": `${scatter[i]?.spin ?? 0}deg`,
      animationDelay: `${i * STAGGER_MS}ms`,
    } as CSSProperties;
  };

  // Reduced-motion visitors get no autoplay: the deck holds on one card until
  // shuffled or expanded.
  const still =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* Autoplay is what makes a one-card deck show more than one card, so it runs
     by default rather than waiting to be driven. It stands down while the fan is
     out (nothing to advance) and while the pointer is over the section, so a
     card can't slide away mid-read. */
  useEffect(() => {
    if (!auto || paused || still || expanded || dragging) return;
    const t = window.setTimeout(() => {
      setDir(1);
      setIndex((v) => (v + 1) % count);
    }, DWELL_MS);
    return () => clearTimeout(t);
  }, [auto, paused, still, expanded, dragging, index, count]);

  const card = cards[index];
  /* The neighbour showing behind, and how far along its reveal is. */
  const peekIndex = (index + peekDir + count) % count;
  const peekProgress = Math.min(1, Math.abs(dx) / PEEK_FULL);

  return (
    <section id="habits" className="hk-habits">
      <div className="hk-head">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-50 sm:text-2xl">
          Coding Habits
        </h2>
        <p className="hk-head-label">How I build</p>
      </div>

      <div
        className={expanded ? "hk-habits-grid hk-habits-grid--open" : "hk-habits-grid"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* ── Left: the pitch, then the controls ── */}
        <div className="hk-habits-lead">
          <p>
            Most portfolios show you the output.{" "}
            <span className="hk-mark">
              They rarely tell you anything about how the person actually works.
            </span>
          </p>
          <p className="hk-habits-sub">
            {expanded
              ? `All ${count} answers about how I actually build.`
              : `${count} answers about how I actually build. One at a time.`}
          </p>

          {/* Two controls, no chrome: reshuffle the order, or lay them all out.
              Paging arrows, a counter and a progress bar all lived here and were
              more furniture than the section needed — autoplay already moves the
              deck along, so what's left is the two things a viewer might
              actually want to do. Labels are on the buttons, not beside them. */}
          <div className="hk-controls">
            <button
              type="button"
              className="hk-icon-btn"
              onClick={shuffle}
              aria-label="Shuffle the cards"
              title="Shuffle"
            >
              <Shuffle aria-hidden />
            </button>
            <button
              type="button"
              className={expanded ? "hk-icon-btn hk-icon-btn--on" : "hk-icon-btn"}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="hk-fan"
              aria-label={expanded ? "Show one card at a time" : `Show all ${count} cards`}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <Minimize2 aria-hidden /> : <LayoutGrid aria-hidden />}
            </button>
          </div>
        </div>

        {/* ── Right: the deck. Stands down when the fan is out. ── */}
        {!expanded && (
          <div className="hk-deck">
            {/* One blank shell at the back for depth. The slot in front of it
                used to be a second blank — it's the real neighbour now, so
                pulling the top card aside uncovers the card you're heading to
                instead of a face-down blank. */}
            <div className="hk-shell hk-shell--2" aria-hidden />

            {/* Straightens, scales up and brightens as the pull progresses, so
                it reads as rising to meet you rather than just sitting there.
                Stops short of the front card's pose — it should still be
                legible as the one underneath. */}
            <div
              className={
                dragging || instant ? "hk-card hk-card--peek hk-card--peek-held" : "hk-card hk-card--peek"
              }
              style={{
                transform: `rotate(${(3.2 * (1 - peekProgress)).toFixed(2)}deg) translateY(${(
                  -4 *
                  (1 - peekProgress)
                ).toFixed(1)}px) scale(${(0.97 + 0.028 * peekProgress).toFixed(3)})`,
                opacity: 0.5 + 0.45 * peekProgress,
              }}
              aria-hidden
            >
              <CardFace card={cards[peekIndex]} size="deck" muted />
            </div>

            <div
              className={
                dragging || instant ? "hk-swipe hk-swipe--held" : "hk-swipe"
              }
              /* Tilts a little with the throw, the way a real card would. */
              style={{ transform: `translateX(${dx}px) rotate(${dx * 0.02}deg)` }}
              onPointerDown={onSwipeDown}
              onPointerMove={onSwipeMove}
              onPointerUp={onSwipeUp}
              onPointerCancel={onSwipeCancel}
              /* Arrow keys do what the swipe does. The pager buttons are gone, so
                 without this the deck would be keyboard-inaccessible. */
              role="group"
              aria-label="Coding habits — swipe or use arrow keys"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                e.preventDefault();
                setAuto(false);
                step(e.key === "ArrowRight" ? 1 : -1);
              }}
            >
              {/* Keyed on the title, not the index: shuffling can leave the index
                  where it was while changing which card that is, and only a key
                  that tracks the card itself remounts — which is what replays the
                  deal animation. */}
              <article
                key={card.title}
                className={`hk-card hk-card--${dir > 0 ? "fwd" : "back"}`}
                aria-live="polite"
                aria-atomic="true"
              >
                <CardFace card={card} size="deck" />
              </article>
            </div>
          </div>
        )}
      </div>

      {/* ══ The fan ══
          Every stamp on the table at once, rotated and overlapping in rows of
          five. Cards that link somewhere are anchors, so the whole stamp is the
          hit target; the rest are plain articles.

          Overlap is 8% of card width here rather than the 20% this layout
          started at. At 20% the right-hand fifth of every card's body text sat
          underneath its neighbour, so a card could only be read by hovering it.
          8% keeps the shingled look and the depth while leaving the text
          clear — the hover lift is then a flourish rather than a requirement. */}
      {expanded && (
        <div
          id="hk-fan"
          className={phase === "idle" ? "hk-fan" : `hk-fan hk-fan--${phase}`}
          role="list"
          aria-label="All coding habits"
          aria-busy={phase !== "idle"}
        >
          {rows.map((row, ri) => (
            <div className="hk-fan-row" key={ri}>
              {row.map((c, ci) => {
                const style = cardStyle(ri, ci);
                return c.href ? (
                  <a
                    key={c.title}
                    role="listitem"
                    style={style}
                    className="hk-card hk-card--fan hk-card--link"
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    <CardFace card={c} size="fan" />
                  </a>
                ) : (
                  <article
                    key={c.title}
                    role="listitem"
                    style={style}
                    className="hk-card hk-card--fan"
                  >
                    <CardFace card={c} size="fan" />
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CodingHabits;
