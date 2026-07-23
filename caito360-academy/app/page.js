"use client";

import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=70&auto=format&fit=crop", cap: "Collaborate", alt: "Team collaborating on AI projects" },
  { src: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=70&auto=format&fit=crop", cap: "Build", alt: "Hands-on automation session" },
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70&auto=format&fit=crop", cap: "Get mentored", alt: "Mentorship and teamwork" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=70&auto=format&fit=crop", cap: "Strategize", alt: "Strategy whiteboarding" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=70&auto=format&fit=crop", cap: "Deliver", alt: "AI practitioner delivering client work" },
];

// Curriculum-aligned skills (from the AI Automation program)
const SKILLS = [
  { t: "AI Workflow Automation", d: "M5 6h4v4H5zM15 14h4v4h-4zM9 8h4a2 2 0 0 1 2 2v6" },
  { t: "No-Code Building", d: "M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" },
  { t: "Business Process Automation", d: "M20 12a8 8 0 0 1-14 5M4 12a8 8 0 0 1 14-5M18 4v3h-3M6 20v-3h3" },
  { t: "AI Agents & Assistants", d: "M7 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4V6a2 2 0 0 1 2-2zM9 10h.01M15 10h.01" },
  { t: "LLMs & Prompting", d: "M4 5h16v10H9l-5 4V5zM8 10h8M8 13h5" },
  { t: "APIs & Integrations", d: "M9 7a3 3 0 1 0 0 6M15 17a3 3 0 1 0 0-6M9 10h6" },
  { t: "Client Project Delivery", d: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5v8" },
  { t: "AI Demos & Portfolio", d: "M4 5h16v11H4zM9 20h6M12 16v4" },
];

// Tools taught (from the program's technology stack)
const TOOLS = [
  { n: "n8n", m: "n8", p: "Workflow automation", c: "var(--teal)", core: true },
  { n: "OpenAI", m: "AI", p: "GPT models", c: "var(--cyan)", core: true },
  { n: "Claude", m: "C", p: "AI reasoning", c: "var(--gold)", core: true },
  { n: "Make.com", m: "M", p: "Visual automations", c: "var(--blue)" },
  { n: "Zapier", m: "Z", p: "App integrations", c: "var(--gold)" },
  { n: "GoHighLevel", m: "G", p: "CRM & funnels", c: "var(--cyan)", core: true },
  { n: "Twilio", m: "T", p: "SMS & voice", c: "var(--teal)" },
  { n: "Google Workspace", m: "GW", p: "Sheets, Gmail, Docs", c: "var(--blue)" },
  { n: "Webhooks / REST", m: "{}", p: "Connect anything", c: "var(--teal)", core: true },
  { n: "Airtable / Notion", m: "A", p: "Databases", c: "var(--cyan)" },
];

const FAQS = [
  { q: "Is it really free?", a: "Yes — the 2-month training costs trainees nothing. You invest your time; we invest the training." },
  { q: "Do I need coding experience?", a: "No. The program is built for beginners and focuses on modern no-code and low-code AI tools." },
  { q: "How much time does it take?", a: "It's an intensive 2-month program. Expect focused, hands-on work with expert guidance throughout." },
  { q: "How do I actually earn?", a: "Once you're trained, you join Caito360's global workforce and earn through a profit-share model on real AI projects." },
  { q: "What happens after I apply?", a: "We review your application and email you the next steps for screening. Selected applicants start training." },
];

function Stat({ to, prefix = "", suffix = "", label, gold }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const dur = 1200, t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <div className={`stat${gold ? " gold" : ""}`} ref={ref}>
      <div className="n">{prefix}{val}{suffix}</div>
      <div className="l">{label}</div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const data = new FormData(formRef.current);
      const res = await fetch("/api/apply", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("success");
      setTimeout(() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  const Logo = ({ id }) => (
    <svg className="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke={`url(#${id})`} strokeWidth="2.5" />
      <path d="M20 6a14 14 0 0 0 0 28" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="5" fill={`url(#${id})`} />
      <defs><linearGradient id={id} x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2FE0C6" /><stop offset="1" stopColor="#38BDF8" /></linearGradient></defs>
    </svg>
  );

  return (
    <>
      {/* ============ NAV ============ */}
      <header>
        <div className="wrap">
          <nav>
            <button className="logo" onClick={scrollTo("top")} aria-label="Back to top">
              <Logo id="g1" />
              <span>Caito360<small>AI ACADEMY</small></span>
            </button>
            <div className="nav-links">
              <a href="#program" onClick={scrollTo("program")}>Program</a>
              <a href="#learn" onClick={scrollTo("learn")}>Learn</a>
              <a href="#tools" onClick={scrollTo("tools")}>Tools</a>
              <a href="#earn" onClick={scrollTo("earn")}>Earn</a>
              <a href="#apply" onClick={scrollTo("apply")}>Apply</a>
            </div>
            <div className="nav-cta">
              <a href="#learn" onClick={scrollTo("learn")} className="btn btn-ghost">Learn More</a>
              <a href="#apply" onClick={scrollTo("apply")} className="btn btn-primary">Apply Now →</a>
              <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  {menuOpen ? <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </nav>
        </div>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <div className="wrap">
            <a href="#program" onClick={scrollTo("program")}>Program</a>
            <a href="#learn" onClick={scrollTo("learn")}>Learn</a>
            <a href="#tools" onClick={scrollTo("tools")}>Tools</a>
            <a href="#earn" onClick={scrollTo("earn")}>Earn</a>
            <a href="#faq" onClick={scrollTo("faq")}>FAQ</a>
            <a href="#apply" onClick={scrollTo("apply")}>Apply</a>
          </div>
        </div>
      </header>

      <div id="top" />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="glow a" /><div className="glow b" />
        <div className="wrap hero-grid">
          <div>
            <h1 className="reveal">
              <span className="line1"><span className="l">Learn.</span> <span className="e">Earn.</span></span>
              <span className="n">NOW.</span>
            </h1>
            <p className="lead reveal">
              <span className="hl-blue">Master AI Automation.</span>{" "}
              <span className="hl-green">Start <span className="nb">Earning <span className="dollar">$</span></span></span>
            </p>
            <div className="hero-actions reveal">
              <a href="#apply" onClick={scrollTo("apply")} className="btn btn-primary">Start Your Application →</a>
              <a href="#learn" onClick={scrollTo("learn")} className="btn btn-ghost">See What You&apos;ll Learn</a>
            </div>
          </div>
          <div className="reveal">
            <div className="hero-visual">
              <svg viewBox="0 0 460 400" width="100%" height="100%" fill="none" aria-label="Sequential journey: you learn and master AI at Caito360, then you earn">
                <defs>
                  <linearGradient id="lg" x1="0" y1="1" x2="1" y2="0">
                    <stop stopColor="rgb(37,99,235)" /><stop offset="0.5" stopColor="var(--gold)" /><stop offset="1" stopColor="rgb(133,187,101)" />
                  </linearGradient>
                  <radialGradient id="core"><stop stopColor="#123056" /><stop offset="1" stopColor="#0C1730" /></radialGradient>
                  <radialGradient id="you"><stop stopColor="#0f2447" /><stop offset="1" stopColor="#0C1730" /></radialGradient>
                  <radialGradient id="earn"><stop stopColor="#12331f" /><stop offset="1" stopColor="#0C1730" /></radialGradient>
                </defs>

                {/* faint rising guide */}
                <path d="M40 340 L420 60" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="2 8" opacity=".5" />

                {/* sequential connecting path (single line, one direction) */}
                <path d="M92 292 L196 224 M264 188 L368 120" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" />
                {/* direction chevrons — centred on each segment, aligned to the slope */}
                <path d="M-5 -5 L0 0 L-5 5" fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(144 258) rotate(-33.2)" />
                <path d="M-5 -5 L0 0 L-5 5" fill="none" stroke="rgb(133,187,101)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(316 154) rotate(-33.2)" />
                {/* single pulse travelling the whole sequence */}
                <circle r="4.5" fill="var(--gold)">
                  <animateMotion dur="3.4s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M92 292 L200 222 L264 188 L368 120" />
                </circle>

                {/* 1 — YOU (start) */}
                <circle cx="66" cy="312" r="34" fill="url(#you)" stroke="rgb(37,99,235)" strokeWidth="1.8" />
                <g stroke="rgb(37,99,235)" strokeWidth="2" fill="none"><circle cx="66" cy="302" r="7" /><path d="M52 326c0-8 6-12 14-12s14 4 14 12" strokeLinecap="round" /></g>
                <text x="66" y="366" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="#fff" fontWeight="700">YOU</text>
                <text x="66" y="382" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--muted)">beginner</text>

                {/* 2 — LEARN / Master AI at Caito360 */}
                <circle cx="230" cy="206" r="46" fill="url(#core)" stroke="var(--gold)" strokeWidth="2">
                  <animate attributeName="r" values="46;49;46" dur="3s" repeatCount="indefinite" />
                </circle>
                <g opacity=".9">
                  <circle cx="230" cy="206" r="30" stroke="var(--teal)" strokeWidth="1" fill="none" opacity=".5" />
                  <circle cx="230" cy="172" r="3.5" fill="var(--teal)"><animateTransform attributeName="transform" type="rotate" from="0 230 206" to="360 230 206" dur="9s" repeatCount="indefinite" /></circle>
                  <circle cx="260" cy="206" r="3" fill="var(--gold)"><animateTransform attributeName="transform" type="rotate" from="120 230 206" to="480 230 206" dur="9s" repeatCount="indefinite" /></circle>
                </g>
                <text x="230" y="202" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fill="#fff" fontWeight="700">CAITO360</text>
                <text x="230" y="218" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--gold)" letterSpacing="1.5">ACADEMY</text>
                <text x="230" y="272" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--teal)" letterSpacing="1">LEARN · MASTER AI</text>

                {/* 3 — EARN (outcome) */}
                <circle cx="394" cy="96" r="34" fill="url(#earn)" stroke="rgb(133,187,101)" strokeWidth="1.8" />
                <text x="394" y="105" textAnchor="middle" fontFamily="var(--font-display)" fontSize="26" fill="rgb(133,187,101)" fontWeight="700">$</text>
                <text x="394" y="150" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="#fff" fontWeight="700">EARN</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats">
        <div className="wrap">
          <div className="stats-grid reveal">
            <Stat to={2} label="Months intensive" />
            <Stat to={10} suffix="+" label="Tools & skills" />
            <Stat to={100} suffix="%" label="Hands-on" />
            <Stat to={0} prefix="$" label="Cost to you" gold />
          </div>
        </div>
      </section>

      {/* ============ PROGRAM AT A GLANCE ============ */}
      <section className="band glance" id="program">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">The Program</span>
            <h2>A career in AI, at a glance</h2>
            <p>No jargon. No cost. A fast, hands-on path from beginner to earning practitioner.</p>
          </div>
          <div className="glance-grid">
            <div className="gcard reveal">
              <svg className="ico" viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="26" rx="4" stroke="var(--teal)" strokeWidth="2.5" /><path d="M6 18h36" stroke="var(--teal)" strokeWidth="2.5" /><circle cx="11" cy="14" r="1.6" fill="var(--teal)" /><path d="M18 42h12" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" /></svg>
              <div className="big">Beginner<br />→ Pro</div><div className="lbl">Skill level</div>
            </div>
            <div className="gcard reveal">
              <svg className="ico" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="var(--cyan)" strokeWidth="2.5" /><path d="M24 14v10l7 5" stroke="var(--cyan)" strokeWidth="2.5" strokeLinecap="round" /></svg>
              <div className="big">2 <span style={{ fontSize: "20px" }}>months</span></div><div className="lbl">Intensive track</div>
            </div>
            <div className="gcard reveal">
              <svg className="ico" viewBox="0 0 48 48" fill="none"><path d="M24 6l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10.1L24 39.2l-9 4.8 1.7-10.1L9.4 26.7l10.1-1.5z" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" /></svg>
              <div className="big free">$0</div><div className="lbl">Cost to trainees</div>
            </div>
            <div className="gcard reveal">
              <svg className="ico" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="var(--gold)" strokeWidth="2.5" /><path d="M24 13v22M18.5 18a5 4 0 0 1 11 0c0 5-11 3-11 8a5 4 0 0 0 11 0" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" /></svg>
              <div className="big cost">Profit<br />Share</div><div className="lbl">Earn on real projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEARN: SKILLS + CURRICULUM ============ */}
      <section className="band why" id="learn">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Learn</span>
            <h2>What you&apos;ll learn</h2>
            <p>Practical AI automation skills that businesses pay for — taught by doing.</p>
          </div>
          <div className="skills-grid">
            {SKILLS.map((s) => (
              <div className="skill reveal" key={s.t}>
                <svg className="ico" viewBox="0 0 24 24" fill="none"><path d={s.d} stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>{s.t}</span>
              </div>
            ))}
          </div>

          <div className="phases">
            <div className="phase one reveal">
              <div className="tag">Month 1</div>
              <h3>Foundations</h3>
              <div className="pills">
                <span>AI &amp; LLM basics</span><span>Prompting</span><span>No-code tools</span><span>Workflow logic</span><span>First automations</span>
              </div>
            </div>
            <div className="phase two reveal">
              <div className="tag">Month 2</div>
              <h3>Real projects</h3>
              <div className="pills">
                <span>AI agents</span><span>Multi-step workflows</span><span>API integrations</span><span>Live client work</span><span>Demos &amp; portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOOLS ============ */}
      <section className="band glance" id="tools">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Toolstack</span>
            <h2>Tools you&apos;ll master</h2>
            <p>The modern no-code and AI stack used to deliver real automation projects.</p>
          </div>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <div className="tool reveal" key={t.n}>
                <span className="tbadge" style={{ background: t.c }}>{t.m}</span>
                <div><b>{t.n}</b><span className="p">{t.p}</span></div>
                {t.core && <span className="core-tag">CORE</span>}
              </div>
            ))}
          </div>

          <div className="pipeline-cap"><b>What you&apos;ll build</b> — a real client automation</div>
          <div className="pipeline reveal">
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="var(--cyan)" strokeWidth="2" /><path d="M8 9h8M8 13h5" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Lead form</span>
            </div>
            <div className="parrow">→</div>
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="var(--gold)" strokeWidth="2" /><circle cx="8" cy="12" r="2" stroke="var(--gold)" strokeWidth="2" /><path d="M13 11h5M13 14h3" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>CRM</span><small>GoHighLevel</small>
            </div>
            <div className="parrow">→</div>
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.5" stroke="var(--teal)" strokeWidth="2" /><circle cx="18" cy="18" r="2.5" stroke="var(--teal)" strokeWidth="2" /><circle cx="18" cy="6" r="2.5" stroke="var(--teal)" strokeWidth="2" /><path d="M8 6h7M6 8v6a4 4 0 0 0 4 4h6" stroke="var(--teal)" strokeWidth="2" /></svg>
              <span>Automate</span><small>n8n</small>
            </div>
            <div className="parrow">→</div>
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" /></svg>
              <span>AI reply</span><small>GPT + Claude</small>
            </div>
            <div className="parrow">→</div>
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="var(--cyan)" strokeWidth="2" strokeLinejoin="round" /></svg>
              <span>SMS + Email</span><small>Twilio</small>
            </div>
            <div className="parrow">→</div>
            <div className="pnode">
              <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="var(--teal)" strokeWidth="2" /><path d="M4 9h16M8 3v4M16 3v4M9 14l2 2 4-4" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Book &amp; update</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="band" id="how">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">The Path</span>
            <h2>Four steps to launch</h2>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="num">01</div>
              <div className="dot"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M14 3v5h5M14 3l6 6v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" /></svg></div>
              <h3>Apply</h3><p>Submit your application and resume below.</p>
            </div>
            <div className="step reveal">
              <div className="num">02</div>
              <div className="dot"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="var(--cyan)" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" /></svg></div>
              <h3>Screening</h3><p>Reply to our follow-up email to proceed.</p>
            </div>
            <div className="step reveal">
              <div className="num">03</div>
              <div className="dot"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 8l9 5 9-5z" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" /><path d="M7 10.5V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" /></svg></div>
              <h3>Train</h3><p>2 months, expert-led, hands-on AI automation.</p>
            </div>
            <div className="step reveal">
              <div className="num">04</div>
              <div className="dot"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3>Deploy &amp; Earn</h3><p>Join Caito360&apos;s workforce on live projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EARN ============ */}
      <section className="band why" id="earn">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Earn</span>
            <h2>How you get paid</h2>
            <p>Train for free, then earn on real work — no upfront cost, ever.</p>
          </div>
          <div className="earn-flow">
            <div className="estep reveal">
              <div className="ring"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 8l9 5 9-5z" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" /><path d="M7 10.5V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" /></svg></div>
              <h3>Train free</h3><p>2 months, zero cost.</p>
            </div>
            <div className="earrow">→</div>
            <div className="estep reveal">
              <div className="ring"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="var(--cyan)" strokeWidth="2" /><path d="M8 10l3 3 5-5" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3>Deliver projects</h3><p>On Caito360&apos;s platform.</p>
            </div>
            <div className="earrow">→</div>
            <div className="estep reveal">
              <div className="ring"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--gold)" strokeWidth="2" /><path d="M12 6v12M9 9.2a4 3 0 0 1 6 0c0 3.5-6 2-6 5a4 3 0 0 0 6 0" stroke="var(--gold)" strokeWidth="1.9" strokeLinecap="round" /></svg></div>
              <h3>Share the profit</h3><p>Earn as you deliver.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY JOIN + CAROUSEL ============ */}
      <section className="band why" id="why">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Why Caito360</span>
            <h2>Built to launch your AI career</h2>
          </div>
          <div className="why-grid">
            <div className="wcard reveal">
              <svg className="ico" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="15" r="7" stroke="var(--teal)" strokeWidth="2.4" /><path d="M9 36c0-7 6-11 13-11s13 4 13 11" stroke="var(--teal)" strokeWidth="2.4" strokeLinecap="round" /></svg>
              <h3>Led by experts</h3><p>Trained by subject-matter experts, overseen by industry veterans.</p>
            </div>
            <div className="wcard reveal">
              <svg className="ico" viewBox="0 0 44 44" fill="none"><rect x="7" y="9" width="30" height="26" rx="3" stroke="var(--cyan)" strokeWidth="2.4" /><path d="M13 22l4 4 8-8" stroke="var(--cyan)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h3>Real projects</h3><p>Learn by delivering actual work on the Caito360 platform.</p>
            </div>
            <div className="wcard reveal">
              <svg className="ico" viewBox="0 0 44 44" fill="none"><circle cx="16" cy="16" r="6" stroke="var(--gold)" strokeWidth="2.4" /><circle cx="30" cy="26" r="6" stroke="var(--gold)" strokeWidth="2.4" /><path d="M8 38c0-5 4-8 8-8M22 12c5 0 8 3 8 8" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" /></svg>
              <h3>Global workforce</h3><p>Join Caito360&apos;s consulting team on live projects worldwide.</p>
            </div>
          </div>

          <div className="marquee reveal" aria-label="Inside the Academy">
            <div className="track">
              {[...PHOTOS, ...PHOTOS].map((p, i) => (
                <div className="tile" key={i}>
                  <img src={p.src} alt={i < PHOTOS.length ? p.alt : ""} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <span className="cap">{p.cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ OUTCOME (earning-focused) ============ */}
      <section className="band outcome">
        <div className="wrap">
          <h2 className="reveal">Get trained. Get deployed.<br />Get paid.</h2>
          <div className="cert reveal">
            <svg viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="18" stroke="var(--gold)" strokeWidth="2.6" /><path d="M23 12v22M17 17.5a6 4.5 0 0 1 12 0c0 6-12 3.5-12 9a6 4.5 0 0 0 12 0" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div><b>Profit-share income</b><span>Earn on real AI projects worldwide</span></div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="band" id="faq">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Questions</span>
            <h2>Answered plainly</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div className={`faq-item reveal${openFaq === i ? " open" : ""}`} key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.q}<span className="plus" aria-hidden="true" />
                </button>
                <div className="faq-a"><div>{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPLY ============ */}
      <section className="band apply" id="apply">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">Apply</span>
            <h2>Ready to build a career in AI?</h2>
            <p>Submit your application with your resume. We&apos;ll follow up by email with next steps.</p>
          </div>

          <div className="next reveal">
            <div className="nstep"><b>1</b> Submit below</div>
            <div className="nstep"><b>2</b> Reply to our email</div>
            <div className="nstep"><b>3</b> Start training</div>
          </div>

          <div className="form-card reveal">
            {status === "success" ? (
              <div className="success">
                <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--teal)" strokeWidth="3" /><path d="M20 33l8 8 16-18" stroke="var(--teal)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h3>Application received</h3>
                <p>Watch your inbox — we&apos;ll email you with the next steps.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                {status === "error" && <div className="form-error">{errorMsg}</div>}
                <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                <div className="row">
                  <div className="field"><label htmlFor="name">Full name <span className="req">*</span></label><input id="name" type="text" name="Name" required placeholder="Your name" /></div>
                  <div className="field"><label htmlFor="email">Email <span className="req">*</span></label><input id="email" type="email" name="Email" required placeholder="you@email.com" /></div>
                </div>
                <div className="row">
                  <div className="field"><label htmlFor="phone">Phone</label><input id="phone" type="tel" name="Phone" placeholder="+00 000 000 0000" /></div>
                  <div className="field"><label htmlFor="loc">Location</label><input id="loc" type="text" name="Location" placeholder="City, Country" /></div>
                </div>
                <div className="field">
                  <label htmlFor="mot">Why AI? <span style={{ textTransform: "none", letterSpacing: 0 }}>(a line or two)</span></label>
                  <textarea id="mot" name="Motivation" placeholder="Tell us briefly why you want to join the Academy." />
                </div>
                <div className="field">
                  <label htmlFor="resume">Resume / CV <span className="req">*</span></label>
                  <label className="file-drop" htmlFor="resume">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "6px" }}><path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div><b>Click to upload</b> — PDF or Word</div>
                    {fileName && <div className="file-name">✓ {fileName}</div>}
                    <input id="resume" type="file" name="attachment" accept=".pdf,.doc,.docx" required onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                  </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
                  {status === "submitting" ? (<><span className="spinner" /> Sending…</>) : "Submit Application →"}
                </button>
                <p className="form-note">By applying you agree to be contacted by Caito360 about the AI Academy.<br />Your information is used only to review your application.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="wrap">
          <button className="logo" onClick={scrollTo("top")} aria-label="Back to top">
            <Logo id="g2" />
            <span>Caito360<small>AI ACADEMY</small></span>
          </button>
          <div>© 2026 Caito360 · Learn. Earn. Now.</div>
          <a href="#apply" onClick={scrollTo("apply")} className="btn btn-primary" style={{ padding: "11px 20px" }}>Apply Now →</a>
        </div>
      </footer>
    </>
  );
}
