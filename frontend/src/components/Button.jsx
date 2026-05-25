import React from 'react'

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
}

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${VARIANTS[variant] || VARIANTS.primary} disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
