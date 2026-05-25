import React from 'react'
import { MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit'
import Button from './Button'

export default function ProductCard({ product, onAdd }) {
  return (
    <MDBCard className="rounded-[1.75rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
      <MDBCardBody className="p-6">
        <div className="mb-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <MDBTypography tag="h6" className="mb-1 text-slate-900">
                {product.name}
              </MDBTypography>
              <MDBTypography className="text-sm text-slate-500">
                {product.description}
              </MDBTypography>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              {product.category || 'Produit'}
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {product.rating ? `${product.rating} ★` : 'Nouveau'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={() => onAdd(product)}>Ajouter au panier</Button>
          <Button variant="secondary" className="text-slate-700" onClick={() => { }}>
            Voir le produit
          </Button>
        </div>
      </MDBCardBody>
    </MDBCard>
  )
}
