import React from 'react'
import Button from './Button'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-[1rem] border border-slate-200 bg-white overflow-hidden card-minimal">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h6 className="mb-1 text-slate-900 font-semibold">{product.name}</h6>
            <div className="text-sm text-slate-500">{product.description || 'Description courte.'}</div>
          </div>
          <div className="text-right">
            <strong className="text-cyan-600">${product.price.toFixed(2)}</strong>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button onClick={() => onAdd(product)} className="btn-pill">Ajouter au panier</Button>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Produit</span>
        </div>
      </div>
    </div>
  )
}
