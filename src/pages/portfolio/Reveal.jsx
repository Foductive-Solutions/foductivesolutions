import React from 'react'
import { useInView } from './hooks'

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

export default Reveal
