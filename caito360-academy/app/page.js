"use client";

import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=70&auto=format&fit=crop", cap: "Collaborate", alt: "Team collaborating on AI projects" },
  { src: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=70&auto=format&fit=crop", cap: "Build", alt: "Hands-on coding session" },
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70&auto=format&fit=crop", cap: "Get mentored", alt: "Mentorship and teamwork" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=70&auto=format&fit=crop", cap: "Strategize", alt: "Strategy whiteboarding" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=70&auto=format&fit=crop", cap: "Deploy", alt: "Deployed AI practitioner at work" },
];

const SKILLS = [
  { t: "AI Automation", d: "M6 12h4l2-5 4 10 2-5h4", },
  { t: "Prompt Engineering", d: "M4 7l5 5-5 5M12 17h8" },
  { t: "AI Agents", d: "M12 4a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V8a4 4 0 0 1 4-4zM6 20a6 6 0 0 1 12 0" },
  { t: "Workflow Design", d: "M5 6h6v4H5zM13 14h6v4h-6zM8 10v4h5" },
  { t: "Data & Documents", d: "M7 4h7l4 4v12H7zM14 4v4h4" },
  { t: "Tool Integration", d: "M9 7a3 3 0 1 0 0 6M15 17a3 3 0 1 0 0-6M9 10h6" },
  { t: "Dashboards", d: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { t: "Responsible AI", d: "M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" },
];

const FAQS = [
  { q: "Is it really free?", a: "Yes — the 2-month training costs trainees nothing. You invest your time; we invest the training." },
  { q: "Do I need coding experience?", a: "No. The program is built for beginners in AI. We take you from the fundamentals to practitioner level." },
  { q: "How much time does it take?", a: "It's an intensive 2-month program. Expect focused, hands-on work with expert guidance throughout." },
  { q: "How do I actually earn?", a: "After you certify, you join Caito360's global workforce and earn through a profit-share model on real AI projects." },
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
    }, { threshold: 0.4 });
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
              <a href="#earn" onClick={scrollTo("earn")}>Earn</a>
              <a href="#faq" onClick={scrollTo("faq")}>FAQ</a>
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
            <div className="badges reveal">
              <span className="chip"><b>100% Free</b> Training</span>
              <span className="chip"><b>2 Months</b> Intensive</span>
              <span className="chip"><b>Global</b> AI Career</span>
            </div>
            <h1 className="reveal">
              <span className="l">Learn.</span><br /><span className="e">Earn.</span><br /><span className="n">Now.</span>
            </h1>
            <p className="lead reveal">
              Go from AI beginner to certified <b style={{ color: "var(--text)" }}>AI Automation Practitioner</b> in two months — then join our global consulting workforce.
            </p>
            <div className="hero-actions reveal">
              <a href="#apply" onClick={scrollTo("apply")} className="btn btn-primary">Start Your Application →</a>
              <a href="#program" onClick={scrollTo("program")} className="btn btn-ghost">See the Program</a>
            </div>
          </div>
          <div className="reveal">
            <div className="hero-visual">
              <svg viewBox="0 0 460 470" width="100%" height="100%" fill="none" aria-label="Your journey: beginner to certified, deployed and earning AI practitioner">
                <defs>
                  <linearGradient id="line" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#2FE0C6" /><stop offset="1" stopColor="#4C7DFF" /></linearGradient>
                  <radialGradient id="core"><stop stopColor="#123056" /><stop offset="1" stopColor="#0C1730" /></radialGradient>
                  <radialGradient id="you"><stop stopColor="#0f2a3f" /><stop offset="1" stopColor="#0C1730" /></radialGradient>
                </defs>

                {/* connecting paths: YOU -> ACADEMY -> outcomes */}
                <g stroke="url(#line)" strokeWidth="1.8" opacity=".5">
                  <path d="M95 210 L215 210" />
                  <path d="M250 190 C320 150 340 130 388 118" fill="none" />
                  <path d="M255 210 L360 210" />
                  <path d="M250 232 C320 272 340 292 388 304" fill="none" />
                </g>

                {/* travelling pulses along the journey */}
                <g>
                  <circle r="4" fill="var(--teal)"><animateMotion dur="2.8s" repeatCount="indefinite" path="M95 210 L215 210 M250 190 C320 150 340 130 388 118" /></circle>
                  <circle r="4" fill="var(--gold)"><animateMotion dur="3.2s" repeatCount="indefinite" path="M95 210 L215 210 M255 210 L360 210" /></circle>
                  <circle r="4" fill="var(--cyan)"><animateMotion dur="3.6s" repeatCount="indefinite" path="M95 210 L215 210 M250 232 C320 272 340 292 388 304" /></circle>
                </g>

                {/* YOU (beginner) */}
                <circle cx="70" cy="210" r="34" fill="url(#you)" stroke="var(--cyan)" strokeWidth="1.6" />
                <g stroke="var(--cyan)" strokeWidth="2" fill="none">
                  <circle cx="70" cy="200" r="7" />
                  <path d="M56 224c0-8 6-12 14-12s14 4 14 12" strokeLinecap="round" />
                </g>
                <text x="70" y="266" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="#fff" fontWeight="700">YOU</text>
                <text x="70" y="282" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--muted)">beginner</text>

                {/* CAITO360 ACADEMY core */}
                <circle cx="230" cy="210" r="46" fill="url(#core)" stroke="var(--gold)" strokeWidth="2">
                  <animate attributeName="r" values="46;49;46" dur="3s" repeatCount="indefinite" />
                </circle>
                <g opacity=".9">
                  <circle cx="230" cy="210" r="30" stroke="var(--teal)" strokeWidth="1" fill="none" opacity=".5" />
                  {/* orbiting skill dots */}
                  <circle cx="230" cy="176" r="3.5" fill="var(--teal)"><animateTransform attributeName="transform" type="rotate" from="0 230 210" to="360 230 210" dur="9s" repeatCount="indefinite" /></circle>
                  <circle cx="260" cy="210" r="3" fill="var(--cyan)"><animateTransform attributeName="transform" type="rotate" from="120 230 210" to="480 230 210" dur="9s" repeatCount="indefinite" /></circle>
                  <circle cx="205" cy="230" r="3" fill="var(--gold)"><animateTransform attributeName="transform" type="rotate" from="240 230 210" to="600 230 210" dur="9s" repeatCount="indefinite" /></circle>
                </g>
                <text x="230" y="206" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fill="#fff" fontWeight="700">CAITO360</text>
                <text x="230" y="222" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--gold)" letterSpacing="1.5">ACADEMY</text>

                {/* Outcomes */}
                {/* Certified (star) */}
                <circle cx="400" cy="118" r="26" fill="url(#core)" stroke="var(--teal)" strokeWidth="1.5" />
                <path d="M400 105l3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9z" fill="var(--teal)" />
                <text x="400" y="162" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#fff">Certified</text>
                {/* Deployed (check) */}
                <circle cx="400" cy="210" r="26" fill="url(#core)" stroke="var(--cyan)" strokeWidth="1.5" />
                <path d="M389 210l7 7 13-14" stroke="var(--cyan)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <text x="400" y="254" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#fff">Deployed</text>
                {/* Earning ($) */}
                <circle cx="400" cy="304" r="26" fill="url(#core)" stroke="var(--gold)" strokeWidth="1.5" />
                <text x="400" y="312" textAnchor="middle" fontFamily="var(--font-display)" fontSize="22" fill="var(--gold)" fontWeight="700">$</text>
                <text x="400" y="348" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#fff">Earning</text>
              </svg>
            </div>
            <div className="hero-stages">
              <span><b>01</b> LEARN</span><span><b>02</b> BUILD</span><span><b>03</b> EARN</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats">
        <div className="wrap">
          <div className="stats-grid reveal">
            <Stat to={2} label="Months intensive" />
            <Stat to={8} suffix="+" label="Core AI skills" />
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
            <p>No jargon. No cost. Just a fast, structured path from beginner to deployed practitioner.</p>
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
              <svg className="ico" viewBox="0 0 48 48" fill="none"><path d="M8 40V26M18 40V16M28 40V22M38 40V10" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" /><path d="M8 12l10 4 8-6 12 4" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".6" /></svg>
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
            <h2>Skills you&apos;ll master</h2>
            <p>Practical, in-demand AI automation skills — taught by doing.</p>
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
                <span>AI fundamentals</span><span>Prompting</span><span>Automation basics</span><span>Tools &amp; setup</span><span>First builds</span>
              </div>
            </div>
            <div className="phase two reveal">
              <div className="tag">Month 2</div>
              <h3>Real projects</h3>
              <div className="pills">
                <span>Live project work</span><span>Agents &amp; workflows</span><span>Best practices</span><span>Delivery</span><span>Certification</span>
              </div>
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

      {/* ============ EARN: PROFIT SHARE ============ */}
      <section className="band glance" id="earn">
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
              <div className="ring"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--gold)" strokeWidth="2" /><path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2.5-5 1.5-5 4a2.5 2 0 0 0 5 0" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" /></svg></div>
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
              <h3>Led by SMEs</h3><p>Trained by subject-matter experts, overseen by industry veterans.</p>
            </div>
            <div className="wcard reveal">
              <svg className="ico" viewBox="0 0 44 44" fill="none"><rect x="7" y="9" width="30" height="26" rx="3" stroke="var(--cyan)" strokeWidth="2.4" /><path d="M13 22l4 4 8-8" stroke="var(--cyan)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h3>Real projects</h3><p>Learn by delivering actual work on the Caito360 platform.</p>
            </div>
            <div className="wcard reveal">
              <svg className="ico" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="18" r="10" stroke="var(--gold)" strokeWidth="2.4" /><path d="M16 27l-3 10 9-5 9 5-3-10" stroke="var(--gold)" strokeWidth="2.4" strokeLinejoin="round" /></svg>
              <h3>Caito Certification</h3><p>Finish certified and ready for the global consulting workforce.</p>
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

      {/* ============ OUTCOME ============ */}
      <section className="band outcome">
        <div className="wrap">
          <h2 className="reveal">Complete the program.<br />Certify. Join the workforce.</h2>
          <div className="cert reveal">
            <svg viewBox="0 0 46 46" fill="none"><circle cx="23" cy="19" r="13" stroke="var(--gold)" strokeWidth="2.6" /><path d="M23 13l2 4.2 4.6.6-3.4 3.2.8 4.6L23 23.4 18 25.6l.8-4.6L15.4 18l4.6-.6z" fill="var(--gold)" /><path d="M16 30l-2 12 9-4 9 4-2-12" stroke="var(--gold)" strokeWidth="2.6" strokeLinejoin="round" /></svg>
            <div><b>Caito Certification</b><span>Your entry to global AI consulting</span></div>
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
