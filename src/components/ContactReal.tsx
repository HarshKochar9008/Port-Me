import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Loader2, Mail, MapPin, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────────────────────────
   Contact — the Real page's own
   -----------------------------------------------------------
   The shared `Contact` component is written for the Design page:
   centred heading, pill eyebrow, SpotlightCard, and colours drawn
   from the shadcn theme tokens. Dropped into this page it read as a
   different site — every other section here is left-aligned with a
   quiet label on the right — and because it styled its background
   with `bg-muted/50 dark:bg-transparent`, it rendered as a light
   grey slab with near-invisible text whenever the theme resolved to
   light. This version hardcodes its own dark palette, so it can't
   drift with the theme, and matches the page's section rhythm.

   The Design page still uses the original, untouched.
   ───────────────────────────────────────────────────────────── */

const EMAIL = "harshkochar88@gmail.com";

const EMAILJS = {
  serviceId: "service_cfanzlk",
  templateId: "template_kiz2db6",
  publicKey: "NWy4KbsPd3UpnnrxE",
} as const;

const SOCIALS = [
  { href: "https://github.com/HarshKochar9008", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/connectharsh1/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://x.com/Too_harshk", icon: Twitter, label: "X" },
] as const;

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-neutral-100 " +
  "placeholder:text-neutral-500 transition-colors duration-200 " +
  "focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-blue-400/30";

const ContactReal = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is permission-gated and unavailable over plain http on some
      // browsers. The address is a mailto link right next to this, so failing
      // quietly is better than an error toast for a convenience affordance.
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        { ...form, reply_to: form.email },
        EMAILJS.publicKey
      );
      toast({ title: "Message sent", description: "Thanks — I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({
        title: "Couldn't send that",
        description: `Something went wrong. Email me directly at ${EMAIL}.`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact">
      <div className="hk-head">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-50 sm:text-2xl">
          Get in touch
        </h2>
        <p className="hk-head-label">Contact</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5 sm:gap-5">
        {/* ── Direct route. Deliberately the larger, louder half: most people
              who reach this section want an address, not a form. ── */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-blue-500/[0.12] via-white/[0.03] to-transparent p-6 md:col-span-2 sm:p-7">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_55%)]"
            aria-hidden
          />
          <div className="relative flex h-full flex-col">
            <p className="text-sm text-neutral-400">Fastest way to reach me</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex min-w-0 items-center gap-2 text-base font-medium text-white underline-offset-4 hover:underline sm:text-lg"
              >
                <Mail className="h-4 w-4 shrink-0 text-blue-300" aria-hidden />
                <span className="truncate">{EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                aria-label={copied ? "Email address copied" : "Copy email address"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-blue-300" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
              </button>
              {/* Announced rather than only shown, so the copy result reaches
                  screen readers too. */}
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            {/* No phone number anywhere on the page by choice — email and the
                socials are the published routes in. */}
            <p className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Bangalore, India · IST (UTC+5:30)
            </p>

            <div className="mt-auto flex items-center gap-2 pt-6">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Or leave a note ── */}
        <form
          onSubmit={submit}
          className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 md:col-span-3 sm:p-7"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="mb-1.5 block text-xs font-medium text-neutral-400">
                Name
              </label>
              <input id="c-name" name="name" value={form.name} onChange={set("name")} required placeholder="Your name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="c-email" className="mb-1.5 block text-xs font-medium text-neutral-400">
                Email
              </label>
              <input id="c-email" name="email" type="email" value={form.email} onChange={set("email")} required placeholder="your@company.com" className={FIELD} />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="c-message" className="mb-1.5 block text-xs font-medium text-neutral-400">
              Message
            </label>
            <textarea id="c-message" name="message" value={form.message} onChange={set("message")} required rows={5} placeholder="What are you building?" className={`${FIELD} resize-y`} />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                Send message
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactReal;
