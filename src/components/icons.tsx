// Minimal stroke icons for the demo stories (24×24, currentColor).
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const PlayIcon = () => <svg {...base}><path d="M7 5v14l11-7z" /></svg>
export const PauseIcon = () => <svg {...base}><path d="M8 5v14M16 5v14" /></svg>
export const DropIcon = () => <svg {...base}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>
export const ShirtIcon = () => <svg {...base}><path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z" /></svg>
export const LeafIcon = () => <svg {...base}><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" /></svg>
export const BoltIcon = () => <svg {...base}><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg>
