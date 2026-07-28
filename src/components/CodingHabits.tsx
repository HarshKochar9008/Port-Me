import { useEffect, useMemo, useRef, useState } from "react";
import { Shuffle } from "lucide-react";
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
   A port of the Bayer-4 ordered-dither pipeline behind the Paxel
   card thumbnails. Rather than shipping pre-rendered PNGs, each
   card's scene is generated procedurally from its seed and then
   dithered to two levels — ink, or nothing at all — so the art is
   deterministic, offline, and weighs nothing.
   ───────────────────────────────────────────────────────────── */

// prettier-ignore
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Inverted against the original: on a dark page the sky becomes transparent
// (the card's glass shows through) and the landform is drawn in light. Ink is
// the portfolio's blue-400 accent so the art belongs to the rest of the page.
const INK: readonly [number, number, number] = [96, 165, 250]; // #60A5FA

// Canvas resolution for the art block. Matches the 220:138 CSS aspect
// ratio; the browser scales it up with `image-rendering: pixelated`,
// which is what gives the chunky dither its bite.
const ART_W = 132;
const ART_H = 83;

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

const DitherArt = ({ seed }: { seed: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = ART_W;
    canvas.height = ART_H;
    const frame = ctx.createImageData(ART_W, ART_H);
    ditherInto(frame.data, renderScene(ART_W, ART_H, seed), ART_W, ART_H);
    ctx.putImageData(frame, 0, 0);
  }, [seed]);

  return <canvas ref={ref} className="hk-mini-art" width={ART_W} height={ART_H} aria-hidden />;
};

/* ─────────────────────────────────────────────────────────────
   Card content
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
  /* Brand mark stamped in the bottom-right corner. Only on cards where a
     single logo genuinely stands for the answer — left off the rest so the
     fan doesn't read as a logo wall. Colours are nudged brighter than the
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
    logo: { icon: SiLinkedin, color: "#4DA3E0" },
  },
  {
    q: "Where does the backend live?",
    title: "Node and Express",
    detail: "REST APIs with MongoDB or PostgreSQL behind them. Wince runs Express.",
    seed: 1036,
    href: byTitle("Wince Scheduler")?.demoUrl,
    logo: { icon: SiNodedotjs, color: "#5FBF5F" },
  },
  {
    /* Points at the repo, not the demo — card 10 already links ApexFlow's live
       site, so this one sends you to the contracts instead of repeating it. */
    q: "What are you building now?",
    title: "Web3 and AI agents",
    detail: "On-chain verification and agentic tooling — contracts you can read.",
    seed: 1019,
    href: byTitle("ApexFlow Token")?.githubUrl,
    logo: { icon: SiEthereum, color: "#8A92E3" },
  },
  {
    q: "What's in beta right now?",
    title: "miniGo",
    detail: "Peer-to-peer transfer. A 6-character code or a QR scan, no cloud.",
    seed: 1037,
    href: MINIGO_POST,
    logo: { icon: SiFlutter, color: "#54C5F8" },
  },
  {
    /* Was the Figma/ChargeNchill card. To make this the "most-viewed post"
       card, swap title for the view count (e.g. "48k views"), detail for the
       post's text, and href for the status URL — the layout already fits it.
       X exposes impressions only to the logged-in author, so those numbers
       have to be read off your own analytics; they can't be fetched. */
    q: "Where else do you post?",
    title: "@Too_harshk",
    detail: "On X, thinking out loud while the thing is still being built.",
    seed: 1039,
    href: "https://x.com/Too_harshk",
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
    logo: { icon: SiGithub, color: "#E6EDF3" },
  },
  {
    q: "What does the stack top out at?",
    title: "MERN, end to end",
    detail: "ApexFlow Token runs MERN alongside smart contracts and wallet auth.",
    seed: 1041,
    href: byTitle("ApexFlow Token")?.demoUrl,
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
  },
];

/* ─────────────────────────────────────────────────────────────
   Shuffle
   -----------------------------------------------------------
   Gather, then deal. Every card walks to the middle of the fan and
   stacks into a pile, the array is reordered while they're piled,
   then they spread back out into their new slots.

   Nothing fades. It doesn't need to: --hk-cx / --hk-cy below are
   each card's distance from the centre *in slot units*, so the
   gather always ends on the fan's midpoint and the spread always
   starts there. A card that changes slot at the swap therefore
   changes which offset it walks back out along — not where it is
   at that instant. The seam lands on a pixel both phases agree on,
   so a reorder mid-pile is invisible without hiding anything.

   GATHER_MS / SPREAD_MS mirror the animation durations in
   CodingHabits.css. Change them in both places.
   ───────────────────────────────────────────────────────────── */
const CARDS_PER_ROW = 5;
const STAGGER_MS = 30;
const GATHER_MS = 750;
const SPREAD_MS = 1050;

/* The last card starts latest, so it also finishes latest — both waits key off
   its delay, not the bare durations. ~2.6s door to door. */
const LAST_DELAY = STAGGER_MS * (HABIT_CARDS.length - 1);
const SWAP_AT = GATHER_MS + LAST_DELAY;
const DONE_AT = SWAP_AT + SPREAD_MS + LAST_DELAY;

type Phase = "idle" | "gather" | "spread";

/** Fisher-Yates. */
function shuffleCards(list: HabitCard[]): HabitCard[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/* Per-card drift and spin, re-rolled every shuffle so no two look alike.
   Fed to the keyframes as custom properties. */
const rollScatter = (count: number) =>
  Array.from({ length: count }, () => ({
    dx: Math.round((Math.random() * 2 - 1) * 90),
    spin: Math.round((Math.random() * 2 - 1) * 26),
  }));

const CardBody = ({ card }: { card: HabitCard }) => {
  const Logo = card.logo?.icon;
  return (
    <>
      <span className="hk-mini-sheen" aria-hidden />
      <DitherArt seed={card.seed} />
      <div className="hk-mini-body">
        <p className="hk-mini-q">{card.q}</p>
        <h3 className="hk-mini-title">{card.title}</h3>
        <p className="hk-mini-detail">{card.detail}</p>
      </div>
      {Logo && (
        <span className="hk-mini-logo" style={{ color: card.logo?.color }} aria-hidden>
          <Logo />
        </span>
      )}
    </>
  );
};

const CodingHabits = () => {
  const [cards, setCards] = useState<HabitCard[]>(HABIT_CARDS);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scatter, setScatter] = useState(() => rollScatter(HABIT_CARDS.length));
  const timers = useRef<number[]>([]);

  // Both timeouts outlive a fast unmount otherwise, and fire into a dead tree.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  const handleShuffle = () => {
    if (phase !== "idle") return; // one shuffle at a time; re-clicks are no-ops
    timers.current = []; // idle means both of the last run's timers have fired
    setScatter(rollScatter(cards.length));
    setPhase("gather");
    timers.current.push(
      window.setTimeout(() => {
        setCards(shuffleCards);
        setPhase("spread");
      }, SWAP_AT),
      window.setTimeout(() => setPhase("idle"), DONE_AT)
    );
  };

  const rows = useMemo(() => {
    const out: HabitCard[][] = [];
    for (let i = 0; i < cards.length; i += CARDS_PER_ROW) {
      out.push(cards.slice(i, i + CARDS_PER_ROW));
    }
    return out;
  }, [cards]);

  /* Stagger keys off the card's position in the fan, so the pile builds card by
     card rather than every card arriving at once.

     --hk-cx / --hk-cy are the card's signed distance from the centre slot,
     measured in slots: +2 means "two slots left of centre", so walking that
     many steps lands it on the middle. The CSS converts steps to px, which is
     what keeps this correct at every --card-w without measuring the DOM. */
  const cardStyle = (rowIndex: number, colIndex: number) => {
    const index = rowIndex * CARDS_PER_ROW + colIndex;
    return {
      "--hk-cx": `${(CARDS_PER_ROW - 1) / 2 - colIndex}`,
      "--hk-cy": `${(rows.length - 1) / 2 - rowIndex}`,
      "--hk-dx": `${scatter[index]?.dx ?? 0}px`,
      "--hk-spin": `${scatter[index]?.spin ?? 0}deg`,
      animationDelay: `${index * STAGGER_MS}ms`,
    } as CSSProperties;
  };

  return (
    <section id="habits" className="hk-habits mt-5 sm:mt-6">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Coding Habits</h2>
        <p className="text-xs text-neutral-400 sm:text-sm">How I build</p>
      </div>

      <div className="hk-habits-panel mt-4">
        <div className="hk-habits-lead text-neutral-300">
          <p>
            Most portfolios show you the output.{" "}
            <span className="hk-mark text-neutral-100">
              They rarely tell you anything about how the person actually works.
            </span>
          </p>
          <p>Here are a few things you'd learn about my coding habits…</p>
        </div>

        <div className="hk-shuffle-bar">
          <button
            type="button"
            className="hk-shuffle"
            onClick={handleShuffle}
            disabled={phase !== "idle"}
            aria-label="Shuffle the cards"
            title="Shuffle"
          >
            <Shuffle className="hk-shuffle-icon" aria-hidden />
          </button>
        </div>

        <div
          className={phase === "idle" ? "hk-cards" : `hk-cards hk-cards--${phase}`}
          role="list"
          aria-label="Coding habits"
          aria-busy={phase !== "idle"}
        >
          {rows.map((row, rowIndex) => (
            <div className="hk-cards-row" key={rowIndex}>
              {row.map((card, colIndex) => {
                const style = cardStyle(rowIndex, colIndex);
                return card.href ? (
                  <a
                    key={card.title}
                    className="hk-mini hk-mini--link"
                    role="listitem"
                    style={style}
                    href={card.href}
                    target={card.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    <CardBody card={card} />
                  </a>
                ) : (
                  <button
                    type="button"
                    key={card.title}
                    className="hk-mini"
                    role="listitem"
                    style={style}
                  >
                    <CardBody card={card} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingHabits;
