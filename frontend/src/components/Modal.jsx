import React from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            className="text-slate-500 transition hover:text-slate-900"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
