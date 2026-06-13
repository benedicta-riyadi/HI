import { useAuth } from "@/hooks/useAuth";
import { useClerk } from "@clerk/react";
import NavBar from "@/components/NavBar";
import {
  Users,
  Layers,
  Rocket,
  Star,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Code2,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, type CSSProperties } from "react";

/* ── Persimmon & Ink — pioHub design system (see DESIGN.md) ─────────────── */

type Role = { label: string; emoji: string; bg: string; text: string; bd: string };

const roles: Role[] = [
  { label: "Frontend",     emoji: "⚡", bg: "#E5F0FC", text: "#2563B0", bd: "#C5DDF5" },
  { label: "Backend",      emoji: "🔧", bg: "#EFEAFB", text: "#6D4FCB", bd: "#DCD2F4" },
  { label: "Designer",     emoji: "🎨", bg: "#FCE7F0", text: "#B23A6E", bd: "#F6CBDD" },
  { label: "Data Science", emoji: "📊", bg: "#E6F5EC", text: "#1F7A4D", bd: "#C8E9D6" },
  { label: "DevOps",       emoji: "☁️", bg: "#FBE6DD", text: "#C24A28", bd: "#F6D3C6" },
  { label: "Mobile",       emoji: "📱", bg: "#E2F4F4", text: "#138080", bd: "#C2E8E8" },
  { label: "Product",      emoji: "🗺️", bg: "#FBF1DC", text: "#8A5A12", bd: "#F0E0B8" },
  { label: "Research",     emoji: "🔬", bg: "#EFEAFB", text: "#5B43B0", bd: "#DCD2F4" },
];

const features = [
  {
    icon: Layers,
    title: "Post the idea you keep thinking about",
    description:
      "Write it down, say who you need. That already counts as starting — the team comes to you.",
  },
  {
    icon: Users,
    title: "Join with what you have",
    description:
      "Designer, coder, writer, organizer. Every project needs more than one kind of mind — bring yours.",
  },
  {
    icon: Rocket,
    title: "Build with committed people",
    description:
      "Owners approve who joins, so teams are made of people who actually want to be there.",
  },
  {
    icon: Star,
    title: "Finish things you can point to",
    description:
      "Every project lives on your profile. Proof that you don't just plan — you try.",
  },
];

const steps = [
  { step: "01", icon: Code2, title: "Make a profile", desc: "Say what you can do and what you care about." },
  { step: "02", icon: Briefcase, title: "Start or join", desc: "Post the idea you've been sitting on, or find one that needs you." },
  { step: "03", icon: Users, title: "Build together", desc: "Meet your team, set up your workspace, make it real." },
];

const stats = [
  { value: "1 idea", label: "is enough to start" },
  { value: "2 min", label: "from idea to posted project" },
  { value: "$0", label: "free for every student" },
];

/* Reveal-on-scroll: enhances an already-visible default. Content renders
   without JS; we only opt into motion when the user allows it. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("js-motion");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    targets.forEach((t) => io.observe(t));
    // Safety: never let a hidden tab / headless render ship blank.
    const t = window.setTimeout(
      () => targets.forEach((el) => el.classList.add("in")),
      1800,
    );
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return ref;
}

const iVar = (i: number) => ({ "--i": i }) as CSSProperties;

function RoleTag({ role, i }: { role: Role; i: number }) {
  return (
    <span
      className="ph-tag ph-pop"
      style={{ background: role.bg, color: role.text, borderColor: role.bd, ...iVar(i) }}
    >
      <span aria-hidden>{role.emoji}</span>
      {role.label}
    </span>
  );
}

/* A small product preview — doubles as the hero's imagery and shows real
   projects, per the "show real projects, not abstractions" principle. */
function MiniProjectCard({
  title, author, ago, tags, members, float, highlighted,
}: {
  title: string; author: string; ago: string;
  tags: { label: string; bg: string; text: string; bd: string }[];
  members: string; float: 1 | 2; highlighted?: boolean;
}) {
  return (
    <div className={`ph-card ph-float-${float}`} style={highlighted ? { borderColor: "var(--accent)" } : undefined}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="ph-card-title" style={highlighted ? { color: "var(--accent-deep)" } : undefined}>{title}</h4>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: highlighted ? "var(--accent-deep)" : "var(--faint)" }} />
      </div>
      <div className="flex justify-between mt-1.5 ph-meta">
        <span>by {author}</span><span>{ago}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tags.map((t) => (
          <span key={t.label} className="ph-tag ph-tag-sm" style={{ background: t.bg, color: t.text, borderColor: t.bd }}>{t.label}</span>
        ))}
      </div>
      <div className="ph-meta mt-3">{members}</div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useClerk();
  const reveal = useReveal();

  const startProject = () =>
    openSignIn({ forceRedirectUrl: "/projects/new", signUpForceRedirectUrl: "/projects/new" });
  const startBuilding = () =>
    openSignIn({ forceRedirectUrl: "/projects", signUpForceRedirectUrl: "/projects" });

  return (
    <div className="ph min-h-screen flex flex-col" ref={reveal}>
      <style>{styles}</style>
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="ph-container grid lg:grid-cols-[1.05fr_0.95fr] gap-x-12 gap-y-16 items-center pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Left: thesis */}
          <div>
            <div className="ph-eyebrow ph-enter" style={iVar(0)}>
              <GraduationCap className="h-4 w-4" />
              For students who want to build
            </div>

            <h1 className="ph-display ph-h1 ph-enter" style={iVar(1)}>
              Start something.{" "}
              <span className="ph-mark-wrap">
                <span className="ph-mark" aria-hidden />
                <span className="ph-mark-text">Or join someone who did.</span>
              </span>
            </h1>

            <p className="ph-lead ph-enter" style={iVar(2)}>
              You don't need a perfect plan — that's what the team is for. pioHub connects
              students with complementary skills and the same commitment, so every idea gets
              the people it needs and every builder gets a place to start.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9 ph-enter" style={iVar(3)}>
              {isAuthenticated ? (
                <>
                  <Link href="/projects/new" className="ph-btn ph-btn-primary group">
                    <Rocket className="h-4 w-4" />
                    Start a project
                  </Link>
                  <Link href="/projects" className="ph-btn ph-btn-outline group">
                    Join a project
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={startProject} className="ph-btn ph-btn-primary group">
                    Start a project
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <Link href="/projects" className="ph-btn ph-btn-outline group">Join a project</Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-12 ph-enter" style={iVar(4)}>
              {roles.map((r, i) => (
                <RoleTag key={r.label} role={r} i={i} />
              ))}
            </div>
          </div>

          {/* Right: product preview (imagery) */}
          <div className="ph-hero-art ph-enter" style={iVar(3)} aria-hidden>
            <MiniProjectCard
              float={1}
              highlighted
              title="Campus food-waste tracker"
              author="James R." ago="5h ago"
              members="2 / 4 members"
              tags={[
                { label: "Frontend", bg: "#E5F0FC", text: "#2563B0", bd: "#C5DDF5" },
                { label: "DevOps", bg: "#FBE6DD", text: "#C24A28", bd: "#F6D3C6" },
              ]}
            />
            <MiniProjectCard
              float={2}
              title="AI study-buddy for lecture notes"
              author="Maya K." ago="2h ago"
              members="1 / 5 members"
              tags={[
                { label: "Backend", bg: "#EFEAFB", text: "#6D4FCB", bd: "#DCD2F4" },
                { label: "Designer", bg: "#FCE7F0", text: "#B23A6E", bd: "#F6CBDD" },
                { label: "ML", bg: "#E6F5EC", text: "#1F7A4D", bd: "#C8E9D6" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ph-band">
        <div className="ph-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-2xl mx-auto text-center sm:text-left">
            {stats.map((s) => (
              <div key={s.label} className="ph-stat">
                <div className="ph-display ph-stat-value">{s.value}</div>
                <div className="ph-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (asymmetric bento — not an identical card grid) ── */}
      <section className="ph-container py-20 sm:py-28">
        <div className="max-w-2xl mb-12">
          <h2 className="ph-display ph-h2">Made for starting</h2>
          <p className="ph-lead-sm mt-3">
            Every part of pioHub exists to shrink the gap between “I have an idea” and
            “we're building it.”
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Lead feature — larger, persimmon-soft */}
          <article className="ph-feature ph-feature-lead lg:row-span-3">
            <div className="ph-feature-icon ph-feature-icon-lead">
              {(() => { const I = features[0].icon; return <I className="h-6 w-6" />; })()}
            </div>
            <h3 className="ph-display ph-feature-title-lead">{features[0].title}</h3>
            <p className="ph-feature-desc">{features[0].description}</p>
          </article>

          {features.slice(1).map((f) => (
            <article key={f.title} className="ph-feature lg:col-span-2 lg:col-start-2 group">
              <div className="flex items-start gap-4">
                <div className="ph-feature-icon shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="ph-feature-title">{f.title}</h3>
                  <p className="ph-feature-desc mt-1.5">{f.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (a real sequence — earns its scroll motion) ── */}
      <section className="ph-band-soft py-20 sm:py-24">
        <div className="ph-container max-w-5xl mx-auto">
          <h2 className="ph-display ph-h2 text-center mb-14">How it works</h2>
          <div className="ph-steps grid sm:grid-cols-3 gap-10 sm:gap-6">
            <div className="ph-steps-track reveal" aria-hidden />
            {steps.map((item, i) => (
              <div key={item.step} className="ph-step reveal text-center" style={iVar(i)}>
                <div className="ph-step-num">{item.step}</div>
                <h3 className="ph-step-title">{item.title}</h3>
                <p className="ph-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (drenched persimmon — the one bold color moment) ── */}
      <section className="ph-container py-20 sm:py-28">
        <div className="ph-cta">
          <h2 className="ph-display ph-cta-title">What would you build if you had the team?</h2>
          <p className="ph-cta-sub">Find out. It's free, and starting takes two minutes.</p>
          {isAuthenticated ? (
            <Link href="/projects" className="ph-btn ph-btn-ink group mt-2">
              Start building
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <button onClick={startBuilding} className="ph-btn ph-btn-ink group mt-2">
              Start building
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ph-footer mt-auto">
        <div className="ph-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 ph-meta-strong">
            <span className="ph-logo-dot"><Layers className="h-3.5 w-3.5" /></span>
            <span className="ph-display" style={{ fontWeight: 600, fontSize: 16 }}>pioHub</span>
            <span className="ph-meta">— Student Collaboration Platform</span>
          </div>
          <p className="ph-meta">© {new Date().getFullYear()} pioNox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Persimmon & Ink — scoped styles, fonts, and motion.
   Self-contained so the page carries its identity regardless of app theme.
──────────────────────────────────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.ph{
  --bg:#FBFAF8; --surface:#fff; --surface-2:#F4F1ED;
  --ink:#221E1A; --muted:#6E665E; --faint:#968D83; --border:#E8E3DD;
  --accent:#EE6C45; --accent-deep:#C24A28; --accent-soft:#FBE6DD;
  --ease:cubic-bezier(.22,1,.36,1);
  background:var(--bg); color:var(--ink);
  font-family:'Manrope',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
}
.ph-container{ width:100%; max-width:1120px; margin-inline:auto; padding-inline:clamp(20px,5vw,40px); }
.ph-display{ font-family:'Fraunces',Georgia,serif; font-optical-sizing:auto; letter-spacing:-.01em; }

/* hero */
.ph-eyebrow{ display:inline-flex; align-items:center; gap:8px; border:1px solid var(--border);
  background:var(--surface); border-radius:9999px; padding:6px 14px; font-size:13px; font-weight:600;
  color:var(--muted); margin-bottom:26px; }
.ph-h1{ font-size:clamp(38px,5.4vw,64px); font-weight:600; line-height:1.02; margin:0;
  text-wrap:balance; }
.ph-mark-wrap{ position:relative; display:inline; white-space:nowrap; }
.ph-mark{ position:absolute; left:-.06em; right:-.06em; bottom:.08em; height:.46em; z-index:0;
  background:var(--accent-soft); border-radius:3px; transform:scaleX(0); transform-origin:left center; }
.ph-mark-text{ position:relative; z-index:1; color:var(--accent-deep); }
.ph-lead{ font-size:clamp(16px,1.6vw,19px); color:var(--muted); line-height:1.7; margin:22px 0 0;
  max-width:60ch; text-wrap:pretty; }
.ph-lead-sm{ font-size:16px; color:var(--muted); line-height:1.65; max-width:54ch; text-wrap:pretty; }

/* buttons */
.ph-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;
  font-family:'Manrope',sans-serif; font-weight:600; font-size:15px; padding:13px 26px; border-radius:12px;
  border:1.5px solid transparent; text-decoration:none; white-space:nowrap;
  transition:transform .18s var(--ease), box-shadow .18s var(--ease), background .18s, border-color .18s, color .18s; }
.ph-btn:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
.ph-btn-primary{ background:var(--accent); color:var(--ink); box-shadow:0 1px 2px rgba(34,30,26,.06); }
.ph-btn-primary:hover{ background:#F07A55; transform:translateY(-2px); box-shadow:0 10px 24px rgba(238,108,69,.30); }
.ph-btn-outline{ background:var(--surface); color:var(--ink); border-color:var(--border); }
.ph-btn-outline:hover{ border-color:var(--accent); color:var(--accent-deep); transform:translateY(-2px); }
.ph-btn-ink{ background:var(--ink); color:#fff; }
.ph-btn-ink:hover{ background:#000; transform:translateY(-2px); box-shadow:0 10px 24px rgba(0,0,0,.18); }

/* role tags */
.ph-tag{ display:inline-flex; align-items:center; gap:5px; border:1px solid; border-radius:9999px;
  font-size:12px; font-weight:600; padding:4px 12px; transition:transform .15s var(--ease); }
.ph-tag-sm{ font-size:10px; padding:2px 9px; }
.ph-tag:hover{ transform:translateY(-2px); }

/* hero product preview */
.ph-hero-art{ position:relative; min-height:320px; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:18px; }
.ph-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px 20px;
  box-shadow:0 18px 48px rgba(34,30,26,.10); width:min(320px,86%); }
.ph-card-title{ font-family:'Manrope',sans-serif; font-size:15px; font-weight:600; color:var(--ink);
  line-height:1.3; margin:0; }
.ph-meta{ font-size:11px; color:var(--faint); }
.ph-meta-strong{ font-size:13px; color:var(--muted); }
.ph-float-1{ transform:rotate(-2deg); }
.ph-float-2{ transform:rotate(2deg) translateX(8%); margin-top:-6px; }

/* stats */
.ph-band{ border-block:1px solid var(--border); background:var(--surface-2); }
.ph-band .ph-container{ padding-block:30px; }
.ph-stat-value{ font-size:30px; font-weight:600; line-height:1; }
.ph-stat-label{ font-size:14px; color:var(--muted); margin-top:6px; }

/* features bento */
.ph-h2{ font-size:clamp(28px,3.6vw,40px); font-weight:600; line-height:1.08; margin:0; }
.ph-feature{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px;
  transition:border-color .2s, box-shadow .2s, transform .2s var(--ease); }
.ph-feature.group:hover{ border-color:var(--accent); transform:translateY(-3px);
  box-shadow:0 14px 36px rgba(34,30,26,.08); }
.ph-feature-lead{ background:var(--accent-soft); border-color:#F6D3C6; padding:30px;
  display:flex; flex-direction:column; }
.ph-feature-icon{ display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px;
  border-radius:11px; background:var(--accent-soft); color:var(--accent-deep); margin-bottom:14px; }
.ph-feature-icon-lead{ background:var(--accent); color:var(--ink); width:48px; height:48px; }
.ph-feature-title{ font-size:16px; font-weight:600; color:var(--ink); margin:0; }
.ph-feature-title-lead{ font-size:24px; font-weight:600; color:var(--ink); margin:6px 0 0; line-height:1.15; }
.ph-feature-desc{ font-size:14px; color:var(--muted); line-height:1.65; margin:10px 0 0; }
.ph-feature-lead .ph-feature-desc{ font-size:15px; margin-top:auto; padding-top:14px; }

/* how it works */
.ph-band-soft{ background:var(--surface-2); border-block:1px solid var(--border); }
.ph-steps{ position:relative; }
.ph-steps-track{ position:absolute; top:23px; left:16%; right:16%; height:2px; background:var(--border);
  transform:scaleX(0); transform-origin:left center; z-index:0; }
.ph-step{ position:relative; z-index:1; }
.ph-step-num{ display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px;
  border-radius:9999px; background:var(--accent); color:var(--ink);
  font-family:'JetBrains Mono',monospace; font-weight:500; font-size:15px; margin-bottom:16px;
  border:3px solid var(--bg); box-shadow:0 0 0 1px var(--accent); }
.ph-band-soft .ph-step-num{ border-color:var(--surface-2); }
.ph-step-title{ font-size:17px; font-weight:600; color:var(--ink); margin:0 0 6px; }
.ph-step-desc{ font-size:14px; color:var(--muted); line-height:1.6; margin:0; }

/* CTA */
.ph-cta{ background:var(--accent); border-radius:24px; padding:clamp(36px,6vw,64px);
  text-align:center; display:flex; flex-direction:column; align-items:center; }
.ph-cta-title{ font-size:clamp(26px,3.6vw,42px); font-weight:600; color:var(--ink); line-height:1.1;
  margin:0; max-width:18ch; text-wrap:balance; }
.ph-cta-sub{ font-size:17px; color:#7a3a22; margin:14px 0 24px; }

/* footer */
.ph-footer{ border-top:1px solid var(--border); }
.ph-footer .ph-container{ padding-block:28px; }
.ph-logo-dot{ display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px;
  border-radius:7px; background:var(--accent); color:var(--ink); }

/* ── MOTION ──────────────────────────────────────────────────────────── */
/* Hero entrance: one orchestrated load sequence (runs above the fold). */
@keyframes phRise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
@keyframes phSwipe{ from{ transform:scaleX(0); } to{ transform:scaleX(1); } }
@keyframes phFloatA{ 0%,100%{ transform:rotate(-2deg) translateY(0); } 50%{ transform:rotate(-2deg) translateY(-7px); } }
@keyframes phFloatB{ 0%,100%{ transform:rotate(2deg) translateX(8%) translateY(0); } 50%{ transform:rotate(2deg) translateX(8%) translateY(7px); } }
@keyframes phPop{ from{ opacity:0; transform:translateY(8px) scale(.96); } to{ opacity:1; transform:none; } }

.ph-enter{ animation:phRise .7s var(--ease) both; animation-delay:calc(var(--i,0) * 90ms); }
.ph-mark{ animation:phSwipe .55s var(--ease) both; animation-delay:.62s; }
.ph-pop{ animation:phPop .5s var(--ease) both; animation-delay:calc(.45s + var(--i,0) * 45ms); }
.ph-float-1{ animation:phFloatA 7s ease-in-out 1.2s infinite; }
.ph-float-2{ animation:phFloatB 8s ease-in-out 1.4s infinite; }

/* Scroll moment (only here): the sequence assembles as it enters view. */
.ph.js-motion .reveal{ opacity:0; }
.ph.js-motion .ph-step.reveal{ transform:translateY(18px); transition:opacity .6s var(--ease), transform .6s var(--ease);
  transition-delay:calc(var(--i,0) * 110ms); }
.ph.js-motion .ph-steps-track.reveal{ transition:transform .7s var(--ease) .15s, opacity .3s; }
.ph.js-motion .ph-step.reveal.in{ opacity:1; transform:none; }
.ph.js-motion .ph-steps-track.reveal.in{ opacity:1; transform:scaleX(1); }

@media (max-width:640px){
  .ph-steps-track{ display:none; }
  .ph-float-1,.ph-float-2{ transform:none; }
}

@media (prefers-reduced-motion: reduce){
  .ph-enter,.ph-mark,.ph-pop,.ph-float-1,.ph-float-2{ animation:none; }
  .ph-mark{ transform:scaleX(1); }
  .ph *{ transition-duration:.01ms !important; }
}
`;
