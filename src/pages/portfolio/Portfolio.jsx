import React, { useEffect, useState } from 'react'
import { COMPANY_INFO } from '../../config/companyInfo'
import {
  IconArrow,
  IconBuilding,
  IconCalendar,
  IconChart,
  IconClipboard,
  IconClose,
  IconCube,
  IconCup,
  IconDroplet,
  IconMenu,
  IconPin,
  IconShield,
  IconTruck,
  IconUsers,
  IconUtensils,
} from './icons'
import Reveal from './Reveal'
import LiquidWave from './LiquidWave'
import OrderEstimator from './OrderEstimator'
import Faq from './Faq'
import { useCountUp, useInView, useMagnetic, useScrollProgress, useTilt } from './hooks'

const NAV_LINKS = [
  { href: '#products', label: 'Products' },
  { href: '#estimate', label: 'Estimate' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#process', label: 'Process' },
  { href: '#serve', label: 'Who We Serve' },
  { href: '#faq', label: 'FAQ' },
]

const PRODUCTS = [
  {
    id: 'lg',
    size: '1000ml',
    title: 'Large Format',
    tag: 'Bulk Supply',
    photo: '/bottle-1000ml.png',
    desc: 'High-capacity bottles built for dispensers, banquet counters and back-of-house stock in busy kitchens.',
    idealFor: ['Restaurants', 'Offices', 'Bulk Orders'],
  },
  {
    id: 'md',
    size: '500ml',
    title: 'Everyday Pack',
    tag: 'Most Popular',
    photo: '/bottle-500ml.png',
    desc: 'The standard for daily service — guest rooms, dining tables and staff hydration, restocked on schedule.',
    idealFor: ['Hotels', 'Cafés', 'Daily Service'],
  },
  {
    id: 'sm',
    size: '200ml',
    title: 'Compact Pack',
    tag: 'Grab & Go',
    photo: '/bottle-200ml.png',
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
  { value: 3, isNumber: true, label: 'Bottle Sizes — 200ml, 500ml & 1000ml' },
  { value: 'B2B', label: 'Built for Hotels, Cafés & Restaurants' },
  { value: 'Daily', label: 'Delivery Routes Across the City' },
  { value: 'Every Batch', label: 'Quality Checked Before Dispatch' },
]

const MARQUEE_ITEMS = ['Hotels', 'Cafés', 'Restaurants', 'Offices', 'Event Caterers', 'Guest Houses', 'Canteens']

const CountStat = ({ target, trigger }) => {
  const value = useCountUp(target, { trigger })
  return <>{value}</>
}

const ScrollProgressBar = () => {
  const progress = useScrollProgress()
  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-white/5">
      <div
        className="h-full bg-linear-to-r from-cyan-400 to-teal-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-cyan-300 shadow-xl backdrop-blur transition hover:border-cyan-400/40 hover:text-cyan-200"
    >
      <IconArrow className="h-5 w-5 -rotate-90" />
    </button>
  )
}

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statsRef, statsInView] = useInView()
  const tilt = useTilt(6)
  const magneticPrimary = useMagnetic(10)
  const magneticCta = useMagnetic(10)

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-200">
      <ScrollProgressBar />
      <BackToTop />

      {/* ---------------------------------- Nav ---------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <img src="/aarich_logo_mark.png" alt="AARICH" className="h-10 w-10 object-contain" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-white">AARICH</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Foductive Solutions</span>
            </span>
          </a>

          <nav className="hidden items-center gap-5 lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-slate-300 transition hover:text-cyan-300">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/client/login"
              className="rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
            >
              Customer Login
            </a>
            <a
              href="/login"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Admin Dashboard
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-1 text-sm font-medium text-slate-300">
                  {l.label}
                </a>
              ))}
              <a href="/client/login" className="mt-1 rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-4 py-2 text-center text-sm font-semibold text-white">
                Customer Login
              </a>
              <a href="/login" className="rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-semibold text-slate-200">
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
                {...magneticPrimary}
                href="#products"
                className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-shadow hover:shadow-cyan-500/40"
              >
                View Our Products
                <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#estimate"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
              >
                Plan Your Order
              </a>
            </div>

            <dl ref={statsRef} className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold tabular-nums text-white">
                    {s.isNumber ? <CountStat target={s.value} trigger={statsInView} /> : s.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-slate-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            {...tilt}
            className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-linear-to-br from-cyan-500/10 to-teal-500/5 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-cyan-500/10">
              <img
                src="/three-bottles-office.png"
                alt="AARICH branded water bottles on a table"
                className="h-[380px] w-full object-cover object-[center_28%] sm:h-[440px] md:h-[520px]"
                loading="eager"
                fetchPriority="high"
              />
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

        <LiquidWave className="text-slate-900" />
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

      {/* ------------------------------- Brand visual break --------------------------- */}
      <section className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        <img
          src="/two-bottles-underwater.png"
          alt="AARICH water bottles suspended underwater above a coral reef"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/10 to-slate-900/85" />
        <Reveal className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Purity, Naturally</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
            Water so clear, it feels like it came straight from the source.
          </h2>
        </Reveal>
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
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10">
                  <span className="absolute right-5 top-5 z-10 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300 backdrop-blur">
                    {p.tag}
                  </span>
                  <div className="relative w-full overflow-hidden bg-slate-900">
                    <img
                      src={p.photo}
                      alt={`AARICH ${p.size} water bottle`}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-slate-950/90 to-transparent" />
                    <span className="absolute bottom-3 left-5 font-display text-lg font-bold text-white">{p.size}</span>
                  </div>
                  <div className="p-8">
                    <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.idealFor.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- Order estimator ----------------------------- */}
      <OrderEstimator />

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
        <LiquidWave className="absolute -top-1 left-0 text-slate-950" flip />
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

      {/* ---------------------------------------- FAQ ----------------------------------- */}
      <Faq />

      {/* ---------------------------------- CTA banner --------------------------------- */}
      <section className="relative overflow-hidden py-24">
        <img
          src="/hero-office-drink.png"
          alt="A professional drinking AARICH bottled water in an office"
          className="absolute inset-0 h-full w-full object-cover object-[60%_25%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-950/92 via-teal-950/85 to-cyan-950/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-size-[24px_24px]" />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to simplify your bulk water supply?</h2>
          <p className="mx-auto mt-4 max-w-xl text-cyan-50/90">
            Browse our bottle sizes and reach out — our team handles the rest, from packing to delivery to billing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              {...magneticCta}
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-teal-700 shadow-lg transition-shadow hover:bg-cyan-50"
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
                <img src="/aarich_logo_mark.png" alt="AARICH" className="h-10 w-10 object-contain" />
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
                <a href="/client/login" className="text-slate-400 transition hover:text-cyan-300">
                  Customer Login
                </a>
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
