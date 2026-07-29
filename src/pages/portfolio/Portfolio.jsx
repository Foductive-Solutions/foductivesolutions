import React, { useEffect, useRef, useState } from 'react'
import { COMPANY_INFO } from '../../config/companyInfo'

/* ---------------------------------------------------------------- */
/*  Minimal hand-drawn icon set (no external icon dependency)        */
/* ---------------------------------------------------------------- */
const line = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const IconDroplet = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.7s7.2 8.2 7.2 13.1A7.2 7.2 0 1 1 4.8 15.8C4.8 10.9 12 2.7 12 2.7Z" /></svg>)
const IconUsers = (p) => (<svg {...line} {...p}><circle cx="8.5" cy="8" r="3" /><circle cx="16.2" cy="9.2" r="2.3" /><path d="M2.7 19.3c0-3.1 2.6-5.4 5.8-5.4s5.8 2.3 5.8 5.4" /><path d="M14.9 14.2c2.5.3 4.5 2.2 4.5 5" /></svg>)
const IconChart = (p) => (<svg {...line} {...p}><path d="M4 20V11M10 20V5M16 20v-7M4 20h16" /></svg>)
const IconClipboard = (p) => (<svg {...line} {...p}><rect x="5" y="4" width="14" height="17" rx="2.2" /><path d="M9 4V3.3A1.3 1.3 0 0 1 10.3 2h3.4A1.3 1.3 0 0 1 15 3.3V4" /><path d="M8.5 11h7M8.5 14.3h7M8.5 17.6h4" /></svg>)
const IconCube = (p) => (<svg {...line} {...p}><path d="M12 3.2 20 7.6v8.8L12 20.8l-8-4.4V7.6l8-4.4Z" /><path d="M12 3.2v9.2M12 12.4 20 7.6M12 12.4 4 7.6M12 12.4v8.4" /></svg>)
const IconShield = (p) => (<svg {...line} {...p}><path d="M12 3 19 6v5.4c0 4.6-3 7.9-7 9-4-1.1-7-4.4-7-9V6l7-3Z" /><path d="M9 12.2l2 2 4-4.2" /></svg>)
const IconTruck = (p) => (<svg {...line} {...p}><rect x="2" y="7" width="11" height="9.5" rx="1.2" /><path d="M13 10.2h3.8L20 13.4v3.1h-7z" /><circle cx="6.6" cy="18" r="1.7" /><circle cx="16.6" cy="18" r="1.7" /></svg>)
const IconMenu = (p) => (<svg {...line} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>)
const IconClose = (p) => (<svg {...line} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)
const IconArrow = (p) => (<svg {...line} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
const IconPin = (p) => (<svg {...line} {...p}><path d="M12 21s7-6.1 7-11.4A7 7 0 1 0 5 9.6C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></svg>)
const IconBuilding = (p) => (<svg {...line} {...p}><rect x="4" y="3" width="16" height="18" rx="1.2" /><path d="M8 7h1.4M8 11h1.4M8 15h1.4M14.6 7H16M14.6 11H16M14.6 15H16" /><path d="M10 21v-4h4v4" /></svg>)
const IconCup = (p) => (<svg {...line} {...p}><path d="M5 9h11v5a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 5 14V9Z" /><path d="M16 10h1.5a2.3 2.3 0 0 1 0 4.6H16" /><path d="M8 4.5c0 1-1 1-1 2M11.5 4.5c0 1-1 1-1 2" /></svg>)
const IconUtensils = (p) => (<svg {...line} {...p}><path d="M7 2.5v7a2 2 0 0 0 2 2v10" /><path d="M7 2.5v5M9.6 2.5v5" /><path d="M16.5 2.5c-1.6 0-2.5 2-2.5 4.6 0 2 1 3.4 2 3.9v10.5" /></svg>)
const IconCalendar = (p) => (<svg {...line} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.6" /><path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" /></svg>)

/* ---------------------------------------------------------------- */
/*  Bottle illustration — pure SVG, sized/tinted per pack             */
/* ---------------------------------------------------------------- */
const BottleGlyph = ({ uid, sizeLabel, from, to, big = false }) => (
  <svg viewBox="0 0 140 300" className={big ? 'h-72 w-full drop-shadow-[0_25px_35px_rgba(8,47,73,0.45)]' : 'h-56 w-full drop-shadow-[0_15px_25px_rgba(8,47,73,0.35)]'}>
    <defs>
      <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
      <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x="52" y="8" width="36" height="18" rx="5" fill="#0f172a" />
    <rect x="58" y="24" width="24" height="26" fill="#0f172a" opacity="0.85" />
    <path
      d="M58 50 L82 50 L118 96 L118 268 A16 16 0 0 1 102 284 L38 284 A16 16 0 0 1 22 268 L22 96 Z"
      fill={`url(#water-${uid})`}
      stroke="rgba(8,47,73,0.35)"
      strokeWidth="2"
    />
    <path
      d="M22 114 Q40 105 58 114 T94 114 T118 114 L118 268 A16 16 0 0 1 102 284 L38 284 A16 16 0 0 1 22 268 Z"
      fill="rgba(255,255,255,0.14)"
    />
    <path d="M34 104 L34 260" stroke={`url(#shine-${uid})`} strokeWidth="9" strokeLinecap="round" />
    <rect x="24" y="188" width="92" height="46" rx="8" fill="white" fillOpacity="0.96" />
    <text x="70" y="217" textAnchor="middle" fontSize="21" fontWeight="700" fill="#0f172a" fontFamily="Sora, sans-serif">
      {sizeLabel}
    </text>
  </svg>
)

/* ---------------------------------------------------------------- */
/*  Scroll-reveal wrapper                                             */
/* ---------------------------------------------------------------- */
const useInView = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

const Reveal = ({ children, className = '', delay = 0 }) => {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Reusable decorative wave divider                                  */
/* ---------------------------------------------------------------- */
const WaveDivider = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 1440 96"
    preserveAspectRatio="none"
    className={`h-16 w-full ${flip ? 'rotate-180' : ''} ${className}`}
  >
    <path d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,96 L0,96 Z" fill="currentColor" />
  </svg>
)

/* ---------------------------------------------------------------- */

const NAV_LINKS = [
  { href: '#products', label: 'Products' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#process', label: 'Process' },
  { href: '#serve', label: 'Who We Serve' },
]

const PRODUCTS = [
  {
    id: 'lg',
    size: '1000ml',
    title: 'Large Format',
    tag: 'Bulk Supply',
    from: '#38bdf8',
    to: '#2563eb',
    desc: 'High-capacity bottles built for dispensers, banquet counters and back-of-house stock in busy kitchens.',
    idealFor: ['Restaurants', 'Offices', 'Bulk Orders'],
  },
  {
    id: 'md',
    size: '500ml',
    title: 'Everyday Pack',
    tag: 'Most Popular',
    from: '#67e8f9',
    to: '#0d9488',
    desc: 'The standard for daily service — guest rooms, dining tables and staff hydration, restocked on schedule.',
    idealFor: ['Hotels', 'Cafés', 'Daily Service'],
  },
  {
    id: 'sm',
    size: '200ml',
    title: 'Compact Pack',
    tag: 'Grab & Go',
    from: '#5eead4',
    to: '#22d3ee',
    desc: 'Convenient single-serve bottles for meetings, events and quick turnarounds where portions matter.',
    idealFor: ['Events', 'Meetings', 'Catering'],
  },
]

const WHY_US = [
  { icon: IconUsers, title: 'Dedicated Accounts', desc: 'Every shop gets its own billing profile with a complete order history on file.' },
  { icon: IconChart, title: 'Transparent Records', desc: 'Clear tracking of every order, payment and pending balance — no surprises.' },
  { icon: IconClipboard, title: 'Flexible Ordering', desc: 'Mix 1000ml, 500ml and 200ml bottles in a single order to match demand.' },
  { icon: IconCube, title: 'Reliable Stock', desc: 'Consistent supply availability maintained across every bottle size.' },
  { icon: IconShield, title: 'Quality First', desc: 'Hygienically packed and quality-checked water in every batch, every time.' },
  { icon: IconTruck, title: 'Timely Delivery', desc: 'Planned delivery routes keep hotels, cafés and restaurants stocked on schedule.' },
]

const PROCESS = [
  { step: '01', title: 'Share Your Requirement', desc: "Tell us your shop or hotel's bottle sizes and quantities." },
  { step: '02', title: 'We Prepare Your Order', desc: 'Bottles are cleaned, filled and quality-checked in batches.' },
  { step: '03', title: 'Doorstep Delivery', desc: 'Delivered on schedule through our distribution routes.' },
  { step: '04', title: 'Simple Billing', desc: 'Transparent invoicing with clear payment tracking.' },
]

const SEGMENTS = [
  { icon: IconBuilding, title: 'Hotels & Guest Houses', desc: 'Room hydration and banquet-grade supply.' },
  { icon: IconCup, title: 'Cafés', desc: 'Reliable daily restock for counters and kitchens.' },
  { icon: IconUtensils, title: 'Restaurants', desc: 'Table service and bulk kitchen consumption.' },
  { icon: IconCalendar, title: 'Events & Catering', desc: 'On-demand compact packs for gatherings.' },
]

const STATS = [
  { value: '3', label: 'Bottle Sizes — 200ml, 500ml & 1000ml' },
  { value: 'B2B', label: 'Built for Hotels, Cafés & Restaurants' },
  { value: 'Daily', label: 'Delivery Routes Across the City' },
  { value: 'Every Batch', label: 'Quality Checked Before Dispatch' },
]

const MARQUEE_ITEMS = ['Hotels', 'Cafés', 'Restaurants', 'Offices', 'Event Caterers', 'Guest Houses', 'Canteens']

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-200">
      {/* ---------------------------------- Nav ---------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-teal-600 shadow-lg shadow-cyan-500/20">
              <IconDroplet className="h-5 w-5 text-white" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-white">AARICH</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Foductive Solutions</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-slate-300 transition hover:text-cyan-300">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Admin Dashboard
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-1 text-sm font-medium text-slate-300">
                  {l.label}
                </a>
              ))}
              <a href="/login" className="mt-1 rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white">
                Admin Dashboard
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ---------------------------------- Hero ---------------------------------- */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -right-16 top-40 h-96 w-96 animate-blob-slow rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 h-72 w-72 animate-blob rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[28px_28px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <IconPin className="h-3.5 w-3.5" /> Wholesale Water Distribution · Pune
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Pure water, <span className="bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">delivered at scale.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-400">
              AARICH supplies hygienically packed drinking water in 200ml, 500ml and 1000ml bottles to hotels, cafés and
              restaurants — with reliable routes and transparent billing built in.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
              >
                View Our Products
                <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
              >
                Admin Dashboard
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold text-white">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-slate-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-linear-to-br from-cyan-500/10 to-teal-500/5 blur-2xl" />
            <div className="grid grid-cols-3 items-end gap-4 rounded-[2rem] border border-white/10 bg-white/3 p-8 backdrop-blur-sm">
              <div className="animate-float-slower">
                <BottleGlyph uid="hero-sm" sizeLabel="200ml" from="#5eead4" to="#22d3ee" />
              </div>
              <div className="animate-float">
                <BottleGlyph uid="hero-md" sizeLabel="500ml" from="#67e8f9" to="#0d9488" big />
              </div>
              <div className="animate-float-slow">
                <BottleGlyph uid="hero-lg" sizeLabel="1000ml" from="#38bdf8" to="#2563eb" />
              </div>
            </div>

            <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur sm:-right-6 sm:-top-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ripple rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-slate-200">Quality Checked</span>
            </div>
          </div>
        </div>

        <WaveDivider className="text-slate-900" />
      </section>

      {/* ------------------------------- Trust marquee ------------------------------ */}
      <section className="border-y border-white/5 bg-slate-900 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-500 sm:px-6">
          Trusted by businesses that serve people every day
        </div>
        <div className="mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-lg font-display font-semibold text-slate-600">
                <IconDroplet className="h-4 w-4 text-cyan-500/60" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Products --------------------------------- */}
      <section id="products" className="bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Our Products</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Bottle sizes for every use case</h2>
            <p className="mt-4 text-slate-400">Order any combination in a single request — stock is tracked and billed per size.</p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-8 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10">
                  <span className="absolute right-5 top-5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                    {p.tag}
                  </span>
                  <BottleGlyph uid={p.id} sizeLabel={p.size} from={p.from} to={p.to} />
                  <h3 className="mt-6 font-display text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.idealFor.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Why us ----------------------------------- */}
      <section id="why-us" className="relative bg-slate-950 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Why Choose AARICH</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Built for reliable bulk supply</h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-linear-to-b from-white/4 to-transparent p-6 transition hover:border-cyan-400/25">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Process ----------------------------------- */}
      <section id="process" className="relative overflow-hidden bg-slate-900 py-24">
        <WaveDivider className="absolute -top-1 left-0 text-slate-950" flip />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">How It Works</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">From order to doorstep</h2>
          </Reveal>

          <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-transparent via-white/15 to-transparent lg:block" />
            {PROCESS.map((s, i) => (
              <Reveal key={s.step} delay={i * 100} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950 font-display text-sm font-bold text-cyan-300">
                  {s.step}
                </div>
                <h3 className="mt-5 font-display font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Who we serve ------------------------------- */}
      <section id="serve" className="bg-slate-950 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Who We Serve</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Serving businesses that never stop</h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center transition hover:-translate-y-1 hover:border-cyan-400/25">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-400/20 to-teal-500/10 text-cyan-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------- CTA banner --------------------------------- */}
      <section className="relative overflow-hidden bg-linear-to-br from-cyan-600 via-teal-600 to-slate-900 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-size-[24px_24px]" />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to simplify your bulk water supply?</h2>
          <p className="mx-auto mt-4 max-w-xl text-cyan-50/90">
            Browse our bottle sizes and reach out — our team handles the rest, from packing to delivery to billing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-teal-700 shadow-lg transition hover:bg-cyan-50"
            >
              View Our Products
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Admin Dashboard
            </a>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------- Footer -------------------------------------- */}
      <footer className="border-t border-white/10 bg-slate-950 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <a href="#top" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-teal-600">
                  <IconDroplet className="h-5 w-5 text-white" />
                </span>
                <span className="font-display text-lg font-bold text-white">AARICH</span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                Wholesale bottled water distribution by {COMPANY_INFO.legalName}, serving hotels, cafés and restaurants
                with reliable supply and transparent billing.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Quick Links</h4>
              <nav className="mt-4 flex flex-col gap-2.5 text-sm">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="text-slate-400 transition hover:text-cyan-300">
                    {l.label}
                  </a>
                ))}
                <a href="/login" className="text-slate-400 transition hover:text-cyan-300">
                  Admin Dashboard
                </a>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Registered Office</h4>
              <p className="mt-4 flex gap-2 text-sm leading-relaxed text-slate-400">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {COMPANY_INFO.registeredAddress}
              </p>
              <p className="mt-3 text-xs text-slate-600">GSTIN: {COMPANY_INFO.gstin}</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.legalName}. All rights reserved.</p>
            <p>{COMPANY_INFO.name} — Wholesale Water Bottle Distribution</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Portfolio
