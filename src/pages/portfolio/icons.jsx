import React from 'react'

/* Minimal hand-drawn icon set (no external icon dependency) */
const line = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconDroplet = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.7s7.2 8.2 7.2 13.1A7.2 7.2 0 1 1 4.8 15.8C4.8 10.9 12 2.7 12 2.7Z" /></svg>)
export const IconUsers = (p) => (<svg {...line} {...p}><circle cx="8.5" cy="8" r="3" /><circle cx="16.2" cy="9.2" r="2.3" /><path d="M2.7 19.3c0-3.1 2.6-5.4 5.8-5.4s5.8 2.3 5.8 5.4" /><path d="M14.9 14.2c2.5.3 4.5 2.2 4.5 5" /></svg>)
export const IconChart = (p) => (<svg {...line} {...p}><path d="M4 20V11M10 20V5M16 20v-7M4 20h16" /></svg>)
export const IconClipboard = (p) => (<svg {...line} {...p}><rect x="5" y="4" width="14" height="17" rx="2.2" /><path d="M9 4V3.3A1.3 1.3 0 0 1 10.3 2h3.4A1.3 1.3 0 0 1 15 3.3V4" /><path d="M8.5 11h7M8.5 14.3h7M8.5 17.6h4" /></svg>)
export const IconCube = (p) => (<svg {...line} {...p}><path d="M12 3.2 20 7.6v8.8L12 20.8l-8-4.4V7.6l8-4.4Z" /><path d="M12 3.2v9.2M12 12.4 20 7.6M12 12.4 4 7.6M12 12.4v8.4" /></svg>)
export const IconShield = (p) => (<svg {...line} {...p}><path d="M12 3 19 6v5.4c0 4.6-3 7.9-7 9-4-1.1-7-4.4-7-9V6l7-3Z" /><path d="M9 12.2l2 2 4-4.2" /></svg>)
export const IconTruck = (p) => (<svg {...line} {...p}><rect x="2" y="7" width="11" height="9.5" rx="1.2" /><path d="M13 10.2h3.8L20 13.4v3.1h-7z" /><circle cx="6.6" cy="18" r="1.7" /><circle cx="16.6" cy="18" r="1.7" /></svg>)
export const IconMenu = (p) => (<svg {...line} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>)
export const IconClose = (p) => (<svg {...line} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>)
export const IconArrow = (p) => (<svg {...line} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const IconPin = (p) => (<svg {...line} {...p}><path d="M12 21s7-6.1 7-11.4A7 7 0 1 0 5 9.6C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></svg>)
export const IconBuilding = (p) => (<svg {...line} {...p}><rect x="4" y="3" width="16" height="18" rx="1.2" /><path d="M8 7h1.4M8 11h1.4M8 15h1.4M14.6 7H16M14.6 11H16M14.6 15H16" /><path d="M10 21v-4h4v4" /></svg>)
export const IconCup = (p) => (<svg {...line} {...p}><path d="M5 9h11v5a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 5 14V9Z" /><path d="M16 10h1.5a2.3 2.3 0 0 1 0 4.6H16" /><path d="M8 4.5c0 1-1 1-1 2M11.5 4.5c0 1-1 1-1 2" /></svg>)
export const IconUtensils = (p) => (<svg {...line} {...p}><path d="M7 2.5v7a2 2 0 0 0 2 2v10" /><path d="M7 2.5v5M9.6 2.5v5" /><path d="M16.5 2.5c-1.6 0-2.5 2-2.5 4.6 0 2 1 3.4 2 3.9v10.5" /></svg>)
export const IconCalendar = (p) => (<svg {...line} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.6" /><path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" /></svg>)
