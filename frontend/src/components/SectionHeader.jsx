import React from 'react'

export default function SectionHeader({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`mb-6 space-y-3 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{eyebrow}</div>
      )}
      <h4 className="font-semibold text-slate-900 text-3xl">{title}</h4>
      {subtitle && (
        <div className={`max-w-3xl text-slate-600 ${center ? 'mx-auto' : ''}`}>{subtitle}</div>
      )}
    </div>
  )
}
