import React, { useState } from 'react'
import Reveal from './Reveal'

const FAQS = [
  {
    q: 'Can I order more than one bottle size at a time?',
    a: 'Yes — mix 200ml, 500ml and 1000ml crates in a single order to match exactly what your shop or kitchen needs that week.',
  },
  {
    q: 'How is my order billed?',
    a: "Every order is recorded against your shop's profile, with a clear invoice and running balance you can review anytime.",
  },
  {
    q: 'Which areas do you deliver to?',
    a: 'We currently serve businesses across Pune through planned delivery routes.',
  },
  {
    q: 'Is the water quality checked?',
    a: 'Yes — every batch is hygienically packed and quality-checked before it leaves for dispatch.',
  },
  {
    q: 'Can I track past orders and payments?',
    a: 'Yes — each account keeps a full history of orders, payments and any pending dues.',
  },
  {
    q: 'How do I get started?',
    a: "Reach out to our team and we'll set up your shop profile and schedule your first delivery.",
  },
]

const FaqItem = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-white/10 py-5">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <span className="font-display font-semibold text-white">{item.q}</span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-cyan-300 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
        aria-hidden="true"
      >
        +
      </span>
    </button>
    <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <p className="text-sm leading-relaxed text-slate-400">{item.a}</p>
      </div>
    </div>
  </div>
)

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Good to know</h2>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          {FAQS.map((item, i) => (
            <FaqItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default Faq
