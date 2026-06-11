import React from 'react'

const VARIANTS = {
  primary: 'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100',
  secondary: 'inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-950/10 hover:bg-slate-800 disabled:opacity-60',
  outline: 'inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-sky-300 hover:bg-sky-50 disabled:opacity-60',
  ghost: 'inline-flex items-center justify-center rounded-full bg-transparent px-5 py-3 text-sm font-semibold text-slate-900 hover:text-sky-700 disabled:opacity-60'
}

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={`${VARIANTS[variant] || VARIANTS.primary} disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
