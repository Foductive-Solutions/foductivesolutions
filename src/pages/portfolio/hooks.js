import { useCallback, useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fires once a ref scrolls into view; used for scroll-reveal and one-shot count-up triggers. */
export const useInView = (options) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options])
  return [ref, inView]
}

/** Normalized 0-1 page scroll position, updated via rAF-throttled scroll listener. */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let ticking = false
    const update = () => {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return progress
}

/** Animates 0 -> target once `trigger` becomes true. Good for scroll-triggered stat counters. */
export const useCountUp = (target, { duration = 900, trigger = true } = {}) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return undefined
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(raf)
    }
    let raf
    const startTime = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, duration])
  return value
}

/** Smoothly tweens the displayed number toward `target` every time it changes. */
export const useTweenNumber = (target, duration = 400) => {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  useEffect(() => {
    const from = fromRef.current
    const delta = target - from
    if (delta === 0) return undefined
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => {
        setDisplay(target)
        fromRef.current = target
      })
      return () => cancelAnimationFrame(raf)
    }
    let raf
    const startTime = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + delta * eased))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return display
}

/** Subtle 3D pointer-tilt for a showcase card. No-op under prefers-reduced-motion. */
export const useTilt = (maxTilt = 8) => {
  const ref = useRef(null)
  const onMouseMove = useCallback(
    (e) => {
      const node = ref.current
      if (!node || prefersReducedMotion()) return
      const rect = node.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      node.style.transform = `perspective(1000px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`
    },
    [maxTilt]
  )
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

/** Cursor-follow magnetic pull for a CTA button. No-op under prefers-reduced-motion. */
export const useMagnetic = (strength = 14) => {
  const ref = useRef(null)
  const onMouseMove = useCallback(
    (e) => {
      const node = ref.current
      if (!node || prefersReducedMotion()) return
      const rect = node.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      node.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`
    },
    [strength]
  )
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}
