// Mesh Text Hover — Originkit (https://www.originkit.dev)
//
// Text is rasterised into a 2D canvas, uploaded as a texture, and dragged
// around by a 96×40 spring mesh that follows the cursor. WebGL2.
//
// Vendored with five changes, all forced by putting a canvas where a heading
// used to be:
//
//   1. `textAlign` is honoured. Upstream hardcodes ctx.textAlign = "center",
//      so the glyphs always sat mid-canvas — which reads as a large random
//      indent once the container is wider than the word. The preview props
//      themselves specify textAlign "left", so this closes that gap.
//   2. WebGL2 fallback. Upstream logs to console and returns, leaving an empty
//      canvas — i.e. the name silently disappears. Now it falls back to plain
//      styled text.
//   3. The render loop pauses when the element scrolls out of view. Upstream
//      steps ~4000 vertices every frame forever; this hero is at the top of a
//      six-section page, so that's a physics sim running against nothing for
//      as long as the tab is open.
//   4. prefers-reduced-motion draws the text once, undistorted, instead of
//      running the loop at all.
//   5. Props are typed, and `any` is gone (tseslint recommended flags it).
//
// The canvas carries no text, so a real heading has to live beside it — see
// the sr-only <h1> at the call site in IndexReal.tsx.
//
// SIZING: needs an explicit height. The wrapper is height:100%, which resolves
// to 0 inside an auto-height parent and renders nothing at all. Pass one via
// `style`.

import * as React from "react";
import { useEffect, useRef, useState } from "react";

const GRID_W = 96;
const GRID_H = 40;
const DRAG = 1.8;
const SPRING_K = 0.08;
const DAMPING = 0.9;
const DT = 0.1;
const CHROMA = 0.005;

const VERT_SRC = `#version 300 es
in vec2 aPos;
in vec2 aUv;
in vec2 aDisp;
out vec2 vUv;
out float vMag;
void main() {
    gl_Position = vec4(aPos + aDisp, 0.0, 1.0);
    vUv = aUv;
    vMag = length(aDisp);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
in float vMag;
out vec4 outColor;
uniform sampler2D uTex;
uniform float uChroma;
uniform vec3 uColorA;
uniform vec3 uColorB;
void main() {
    vec4 base = texture(uTex, vUv);
    if (uChroma > 0.0) {
        float o = uChroma * ${CHROMA.toFixed(5)} * clamp(vMag * 8.0, 0.0, 1.0);
        float aOff = texture(uTex, vUv + vec2(o, 0.0)).a;
        float bOff = texture(uTex, vUv - vec2(o, 0.0)).a;
        // Base text colour where the glyph is solid + colour A on the
        // +offset fringe + colour B on the -offset fringe.
        vec3 col = base.rgb * base.a;
        col += uColorA * max(0.0, aOff - base.a);
        col += uColorB * max(0.0, bOff - base.a);
        float aMax = max(base.a, max(aOff, bOff));
        outColor = vec4(col, aMax);
    } else {
        outColor = base;
    }
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

function linkProgram(
    gl: WebGL2RenderingContext,
    vs: WebGLShader,
    fs: WebGLShader
) {
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
    }
    return p;
}

const VARIANT_WEIGHTS: Record<string, number> = {
    Thin: 100,
    Hairline: 100,
    ExtraLight: 200,
    UltraLight: 200,
    Light: 300,
    Regular: 400,
    Normal: 400,
    Book: 400,
    Medium: 500,
    SemiBold: 600,
    DemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    UltraBold: 800,
    Black: 900,
    Heavy: 900,
};

function variantToWeight(variant?: string): number {
    if (!variant) return 400;
    const base = variant
        .replace(/\s*Italic\s*/i, "")
        .trim()
        .replace(/\s+/g, "");
    return VARIANT_WEIGHTS[base] ?? 400;
}

function variantIsItalic(variant?: string): boolean {
    return !!variant && /italic/i.test(variant);
}

function toNum(v: unknown, fallback: number): number {
    if (typeof v === "number" && isFinite(v)) return v;
    if (typeof v === "string") {
        const m = parseFloat(v);
        if (isFinite(m)) return m;
    }
    return fallback;
}

type RGB = [number, number, number];

// Parse a CSS colour string ("#rgb", "#rrggbb", "rgb(r,g,b)", "rgba(...)")
// into a [0..1, 0..1, 0..1] tuple. Falls back to white.
function parseColor(v: unknown): RGB {
    if (typeof v !== "string") return [1, 1, 1];
    const s = v.trim();
    if (s.startsWith("#")) {
        let h = s.slice(1);
        if (h.length === 3)
            h = h
                .split("")
                .map((c) => c + c)
                .join("");
        if (h.length >= 6) {
            const r = parseInt(h.slice(0, 2), 16) / 255;
            const g = parseInt(h.slice(2, 4), 16) / 255;
            const b = parseInt(h.slice(4, 6), 16) / 255;
            if (isFinite(r) && isFinite(g) && isFinite(b)) return [r, g, b];
        }
    }
    const m = s.match(/rgba?\s*\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (m) {
        return [
            parseInt(m[1], 10) / 255,
            parseInt(m[2], 10) / 255,
            parseInt(m[3], 10) / 255,
        ];
    }
    return [1, 1, 1];
}

type MeshTextAlign = "left" | "center" | "right";

function renderTextToCanvas(
    text: string,
    color: string,
    fontFamily: string,
    fontWeight: string | number,
    fontStyle: string,
    fontSize: number,
    width: number,
    height: number,
    textAlign: MeshTextAlign,
    inset: number
): HTMLCanvasElement {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = "middle";
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}, sans-serif`;
    // Left/right alignment is held off the edge by `inset`: the wrapper clips
    // (overflow: hidden), so a glyph flush to x=0 loses its distortion the
    // moment the mesh pulls it outward.
    const x =
        textAlign === "left"
            ? inset
            : textAlign === "right"
              ? width - inset
              : width / 2;
    ctx.fillText(text, x, height / 2);
    return c;
}

type MeshFont = {
    fontFamily?: string;
    variant?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
    fontStyle?: string;
    textAlign?: MeshTextAlign;
    lineHeight?: number | string;
};

type Props = {
    text?: string;
    color?: string;
    font?: MeshFont;
    /** Chromatic fringing on the leading/trailing edge of the distortion. */
    colorSplit?: boolean;
    /** Fringe colours, cycled in pairs every 400ms. */
    customColors?: string[];
    /** Cursor pull strength on a friendly 0–50 scale (18 ≈ upstream 1.8). */
    force?: number;
    className?: string;
    /** Must set an explicit height — the wrapper is height:100%. */
    style?: React.CSSProperties;
};

const COMPONENT_DEFAULTS = {
    text: "MESH",
    color: "#ffffff",
    font: {
        fontFamily: "Inter",
        variant: "Bold",
        fontSize: 180,
        lineHeight: "1em",
    } as MeshFont,
    colorSplit: true,
    customColors: ["#ff40c0", "#40ff80"],
    force: 18,
};

export default function MeshText(userProps: Props) {
    const props = { ...COMPONENT_DEFAULTS, ...userProps };
    const { text, color, font, colorSplit, customColors, force, className, style } =
        props;

    /* No WebGL2 → the canvas would stay blank and the name would just be gone.
       Flipped from inside the effect, which then bails; render falls through to
       plain text below. */
    const [webglFailed, setWebglFailed] = useState(false);

    // Live refs so the toggle / slider take effect mid-loop without
    // rebuilding the WebGL state.
    const colorSplitRef = useRef<boolean>(!!colorSplit);
    colorSplitRef.current = !!colorSplit;
    // Parsed RGB triples (0..1). Cycled through over time in the render loop.
    const customColorsRef = useRef<RGB[]>([]);
    customColorsRef.current = Array.isArray(customColors)
        ? customColors.map(parseColor)
        : [];
    // UI exposes a friendly 0-50 slider; internal physics use ÷ 10 so the
    // default (18) matches the original DRAG = 1.8 feel.
    const forceRef = useRef<number>(
        typeof force === "number" ? force / 10 : DRAG
    );
    forceRef.current = typeof force === "number" ? force / 10 : DRAG;

    // Framer's Font control returns fontFamily / fontSize / variant (e.g.
    // "Bold Italic") — plus sometimes explicit fontWeight / fontStyle. Read
    // each robustly (number OR string) and derive weight + italic from variant
    // when needed.
    const fontFamily: string = font?.fontFamily ?? "Inter";
    const fontVariant: string = font?.variant ?? "Regular";
    const fontSize: number = toNum(font?.fontSize, 180);
    const fontWeight: number = toNum(
        font?.fontWeight,
        variantToWeight(fontVariant)
    );
    const fontStyle: string =
        typeof font?.fontStyle === "string"
            ? font.fontStyle
            : variantIsItalic(fontVariant)
              ? "italic"
              : "normal";
    const textAlign: MeshTextAlign = font?.textAlign ?? "center";

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const gl = canvas.getContext("webgl2", {
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
        });
        if (!gl) {
            setWebglFailed(true);
            return;
        }

        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // ── Grid geometry ───────────────────────────────────────────────
        const vertCount = (GRID_W + 1) * (GRID_H + 1);
        const positions = new Float32Array(vertCount * 2);
        const uvs = new Float32Array(vertCount * 2);
        for (let y = 0; y <= GRID_H; y++) {
            for (let x = 0; x <= GRID_W; x++) {
                const i = y * (GRID_W + 1) + x;
                const u = x / GRID_W;
                const v = y / GRID_H;
                positions[i * 2] = u * 2 - 1;
                positions[i * 2 + 1] = 1 - v * 2;
                uvs[i * 2] = u;
                uvs[i * 2 + 1] = v;
            }
        }
        const indexCount = GRID_W * GRID_H * 6;
        const indices = new Uint32Array(indexCount);
        let idx = 0;
        for (let y = 0; y < GRID_H; y++) {
            for (let x = 0; x < GRID_W; x++) {
                const a = y * (GRID_W + 1) + x;
                const b = a + 1;
                const c = a + (GRID_W + 1);
                const d = c + 1;
                indices[idx++] = a;
                indices[idx++] = c;
                indices[idx++] = b;
                indices[idx++] = b;
                indices[idx++] = c;
                indices[idx++] = d;
            }
        }

        const disp = new Float32Array(vertCount * 2);
        const vel = new Float32Array(vertCount * 2);

        // ── GL setup ────────────────────────────────────────────────────
        const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
        if (!vs || !fs) return;
        const program = linkProgram(gl, vs, fs);
        if (!program) return;

        const aPos = gl.getAttribLocation(program, "aPos");
        const aUv = gl.getAttribLocation(program, "aUv");
        const aDisp = gl.getAttribLocation(program, "aDisp");
        const uTex = gl.getUniformLocation(program, "uTex");
        const uChroma = gl.getUniformLocation(program, "uChroma");
        const uColorA = gl.getUniformLocation(program, "uColorA");
        const uColorB = gl.getUniformLocation(program, "uColorB");

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uvBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(aUv);
        gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

        const dispBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dispBuf);
        gl.bufferData(gl.ARRAY_BUFFER, disp, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aDisp);
        gl.vertexAttribPointer(aDisp, 2, gl.FLOAT, false, 0, 0);

        const idxBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        let cancelled = false;

        // ── Draw ────────────────────────────────────────────────────────
        // Split out of the loop so a paused/reduced-motion mount can still put
        // the glyphs on screen exactly once.
        const draw = () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, dispBuf);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, disp);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(uTex, 0);
            gl.uniform1f(uChroma, colorSplitRef.current ? 1.0 : 0.0);

            // Pick the two split colours by cycling through the user
            // array (each pair (i, i+1) held for 400 ms then advance).
            // Empty array → fall back to red + blue.
            let cA: RGB = [1, 0, 0];
            let cB: RGB = [0, 0, 1];
            const cols = customColorsRef.current;
            if (cols.length === 1) {
                cA = cols[0];
                cB = cols[0];
            } else if (cols.length > 1) {
                const cycleMs = 400;
                const ci = Math.floor(performance.now() / cycleMs) % cols.length;
                cA = cols[ci];
                cB = cols[(ci + 1) % cols.length];
            }
            gl.uniform3f(uColorA, cA[0], cA[1], cA[2]);
            gl.uniform3f(uColorB, cB[0], cB[1], cB[2]);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            gl.bindVertexArray(vao);
            gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_INT, 0);
        };

        const rebuildTex = async () => {
            const w = Math.max(2, canvas.width);
            const h = Math.max(2, canvas.height);
            const dpr = window.devicePixelRatio || 1;
            const realSize = fontSize * dpr;
            // Wait for the requested font to be ready. Use both .load and
            // .ready — without this canvas 2D silently falls back to the
            // system font on first paint.
            try {
                if (typeof document !== "undefined") {
                    const fontStr = `${fontStyle} ${fontWeight} ${realSize}px ${fontFamily}`;
                    if (document.fonts?.load) {
                        await document.fonts.load(fontStr);
                    }
                    if (document.fonts?.ready) {
                        await document.fonts.ready;
                    }
                }
            } catch {
                /* ignore */
            }
            if (cancelled) return;
            const c2 = renderTextToCanvas(
                String(text ?? ""),
                color ?? "#ffffff",
                fontFamily,
                fontWeight,
                fontStyle,
                realSize,
                w,
                h,
                textAlign,
                realSize * 0.12
            );
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                c2
            );
            // The loop may be paused (offscreen) or never started (reduced
            // motion); paint the fresh texture regardless.
            draw();
        };

        // ── Resize ──────────────────────────────────────────────────────
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = wrapper.getBoundingClientRect();
            const w = Math.max(2, Math.round(rect.width * dpr));
            const h = Math.max(2, Math.round(rect.height * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
                rebuildTex();
            }
        };
        const ro = new ResizeObserver(resize);
        ro.observe(wrapper);
        resize();
        // Initial rebuild (in case resize was a no-op because size matched)
        rebuildTex();

        // ── Mouse tracking ──────────────────────────────────────────────
        const cursor = {
            x: 99,
            y: 99,
            px: 99,
            py: 99,
            vx: 0,
            vy: 0,
            inside: false,
        };
        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;
            const x = nx * 2 - 1;
            const y = 1 - ny * 2;
            if (!cursor.inside) {
                cursor.px = x;
                cursor.py = y;
                cursor.inside = true;
            }
            cursor.x = x;
            cursor.y = y;
        };
        const onLeave = () => {
            cursor.inside = false;
            cursor.x = 99;
            cursor.y = 99;
            cursor.vx = 0;
            cursor.vy = 0;
        };
        wrapper.addEventListener("pointermove", onMove);
        wrapper.addEventListener("pointerleave", onLeave);

        // ── Animation loop ──────────────────────────────────────────────
        let rafId = 0;
        let running = false;

        const tick = () => {
            if (!running) return;

            cursor.vx = cursor.x - cursor.px;
            cursor.vy = cursor.y - cursor.py;
            const vmag = Math.hypot(cursor.vx, cursor.vy);
            if (vmag > 0.3) {
                cursor.vx = 0;
                cursor.vy = 0;
            }
            cursor.px = cursor.x;
            cursor.py = cursor.y;

            // Drag only — mesh vertices pulled along the cursor's motion.
            for (let i = 0; i < vertCount; i++) {
                const i2 = i * 2;
                const px = positions[i2];
                const py = positions[i2 + 1];
                const dx = disp[i2];
                const dy = disp[i2 + 1];

                const cx = cursor.x - (px + dx);
                const cy = cursor.y - (py + dy);
                const cd = Math.hypot(cx, cy);
                const proximity = Math.max(0, 1 / (1 + cd / 0.05) - 0.1);

                let vx = vel[i2];
                let vy = vel[i2 + 1];

                const fpull = forceRef.current;
                vx += cursor.vx * fpull * proximity;
                vy += cursor.vy * fpull * proximity;

                vx -= dx * SPRING_K;
                vy -= dy * SPRING_K;

                vx *= DAMPING;
                vy *= DAMPING;

                vel[i2] = vx;
                vel[i2 + 1] = vy;

                let ndx = dx + vx * DT;
                let ndy = dy + vy * DT;
                if (ndx > 1) ndx = 1;
                else if (ndx < -1) ndx = -1;
                if (ndy > 1) ndy = 1;
                else if (ndy < -1) ndy = -1;
                disp[i2] = ndx;
                disp[i2 + 1] = ndy;
            }

            draw();
            rafId = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || reduced || cancelled) return;
            running = true;
            rafId = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(rafId);
        };

        /* The hero is the first of six sections — without this the mesh keeps
           stepping ~4000 vertices per frame while the reader is five screens
           further down. Resting displacement is ~0, so there is nothing to
           catch up on when it resumes. */
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) start();
                else stop();
            },
            { threshold: 0 }
        );
        io.observe(wrapper);

        if (reduced) draw();

        return () => {
            cancelled = true;
            stop();
            io.disconnect();
            ro.disconnect();
            wrapper.removeEventListener("pointermove", onMove);
            wrapper.removeEventListener("pointerleave", onLeave);
            gl.deleteBuffer(posBuf);
            gl.deleteBuffer(uvBuf);
            gl.deleteBuffer(dispBuf);
            gl.deleteBuffer(idxBuf);
            gl.deleteTexture(tex);
            gl.deleteVertexArray(vao);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        };
    }, [
        text,
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        fontSize,
        textAlign,
    ]);

    /* No WebGL2: draw the name as ordinary text rather than nothing at all.
       Mirrors the canvas metrics so the hero keeps its height either way. */
    if (webglFailed) {
        return (
            <div
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        textAlign === "left"
                            ? "flex-start"
                            : textAlign === "right"
                              ? "flex-end"
                              : "center",
                    width: "100%",
                    height: "100%",
                    fontFamily,
                    fontWeight,
                    fontStyle,
                    fontSize: `${fontSize}px`,
                    lineHeight: 1,
                    color,
                    whiteSpace: "nowrap",
                    ...style,
                }}
            >
                {text}
            </div>
        );
    }

    return (
        <div
            ref={wrapperRef}
            className={className}
            aria-hidden="true"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                userSelect: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}
