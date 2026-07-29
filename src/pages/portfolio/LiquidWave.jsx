import React from 'react'

/**
 * Two parallax SVG wave layers drifting at different speeds/directions.
 * `className` sets the foreground layer's color via `currentColor` (text-*).
 */
const LiquidWave = ({ className = '', flip = false }) => (
  <div className={`relative h-16 w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}>
    <svg
      viewBox="0 0 2880 96"
      preserveAspectRatio="none"
      className="absolute left-0 top-0 h-full w-[200%] animate-wave-drift-slow text-white/5"
    >
      <path
        d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,96 L0,96 Z
           M1440,32 C1680,80 1920,0 2160,32 C2400,64 2640,16 2880,48 L2880,96 L1440,96 Z"
        fill="currentColor"
      />
    </svg>
    <svg
      viewBox="0 0 2880 96"
      preserveAspectRatio="none"
      className="absolute left-0 top-0 h-full w-[200%] animate-wave-drift"
    >
      <path
        d="M0,48 C240,8 480,72 720,44 C960,16 1200,72 1440,40 L1440,96 L0,96 Z
           M1440,48 C1680,8 1920,72 2160,44 C2400,16 2640,72 2880,40 L2880,96 L1440,96 Z"
        fill="currentColor"
      />
    </svg>
  </div>
)

export default LiquidWave
