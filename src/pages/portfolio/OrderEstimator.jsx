import React, { useMemo, useState } from 'react'
import Reveal from './Reveal'
import RequestOrderModal from './RequestOrderModal'
import { useTweenNumber } from './hooks'

const SIZES = [
  { id: 'sm', label: '200ml', sub: 'Compact Pack', from: '#5eead4', to: '#22d3ee' },
  { id: 'md', label: '500ml', sub: 'Everyday Pack', from: '#67e8f9', to: '#0d9488' },
  { id: 'lg', label: '1000ml', sub: 'Large Format', from: '#38bdf8', to: '#2563eb' },
]

const STEP = 5
const MAX_CRATES = 200
const QUICK_PICKS = [10, 25, 50, 100]
const INITIAL_COUNTS = { sm: 0, md: 0, lg: 0 }

const OrderEstimator = () => {
  const [counts, setCounts] = useState(INITIAL_COUNTS)
  const [requestOpen, setRequestOpen] = useState(false)
  const total = counts.sm + counts.md + counts.lg
  const displayTotal = useTweenNumber(total, 400)

  const adjust = (id, delta) => {
    setCounts((c) => ({ ...c, [id]: Math.min(MAX_CRATES, Math.max(0, c[id] + delta)) }))
  }
  const setQuick = (id, value) => {
    setCounts((c) => ({ ...c, [id]: c[id] === value ? 0 : value }))
  }
  const reset = () => setCounts(INITIAL_COUNTS)

  const shares = useMemo(
    () => SIZES.map((s) => ({ ...s, count: counts[s.id], pct: total ? (counts[s.id] / total) * 100 : 0 })),
    [counts, total]
  )

  return (
    <section id="estimate" className="relative bg-slate-900 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Plan Your Order</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Mix &amp; match your crates</h2>
          <p className="mt-4 text-slate-400">
            A quick planning tool — sketch out your crate mix across bottle sizes before you confirm with our team.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            {SIZES.map((s) => (
              <div key={s.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display font-semibold text-white">{s.label}</p>
                      <p className="text-xs text-slate-500">{s.sub}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjust(s.id, -STEP)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-lg leading-none text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                      aria-label={`Decrease ${s.label} crates`}
                    >
                      −
                    </button>
                    <span className="w-16 text-center font-display text-lg font-bold tabular-nums text-white">
                      {counts[s.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjust(s.id, STEP)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-lg leading-none text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                      aria-label={`Increase ${s.label} crates`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_PICKS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuick(s.id, q)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        counts[s.id] === q
                          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300'
                          : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                      }`}
                    >
                      {q} crates
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-linear-to-b from-cyan-500/10 to-transparent p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Crates</p>
              <p className="mt-2 font-display text-5xl font-bold tabular-nums text-white" aria-live="polite">
                {displayTotal}
              </p>

              <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/5">
                <div className="flex h-full w-full">
                  {shares.map((s) =>
                    s.pct > 0 ? (
                      <div
                        key={s.id}
                        className="h-full transition-all duration-500 ease-out"
                        style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.from}, ${s.to})` }}
                      />
                    ) : null
                  )}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {shares.map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.to }} aria-hidden="true" />
                      {s.label}
                    </span>
                    <span className="tabular-nums text-slate-300">{s.count} crates</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-xs text-slate-500">
                Planning estimate only — final rates and availability are confirmed by our team.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRequestOpen(true)}
                  className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
                >
                  Request Order
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/25"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {requestOpen && <RequestOrderModal onClose={() => setRequestOpen(false)} counts={counts} />}
    </section>
  )
}

export default OrderEstimator
