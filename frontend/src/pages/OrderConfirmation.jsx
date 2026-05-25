import React from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBBtn
} from 'mdb-react-ui-kit'

export default function OrderConfirmation({ order, onContinue }) {
  if (!order) {
    return (
      <MDBCard className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-xl">
        <MDBTypography className="text-slate-500">Aucune information de commande disponible.</MDBTypography>
      </MDBCard>
    )
  }

  return (
    <div className="space-y-6">
      <MDBCard className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl">
        <MDBCardBody className="space-y-4 p-8">
          <MDBTypography tag="h4" className="text-3xl font-semibold">
            Commande confirmée
          </MDBTypography>
          <MDBTypography className="text-slate-100/90">Votre commande a été enregistrée avec succès.</MDBTypography>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-4">
              <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-200/90">Commande</MDBTypography>
              <MDBTypography className="mt-2 text-lg font-semibold">#{order.id}</MDBTypography>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-200/90">Montant total</MDBTypography>
              <MDBTypography className="mt-2 text-lg font-semibold">${order.totalAmount.toFixed(2)}</MDBTypography>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>

      <MDBCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <MDBCardBody className="space-y-4">
          <MDBTypography tag="h6" className="text-slate-900">
            Items
          </MDBTypography>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <MDBTypography className="font-semibold text-slate-900">{item.product?.name}</MDBTypography>
                  <MDBTypography className="text-sm text-slate-500">Qty {item.quantity}</MDBTypography>
                </div>
                <MDBTypography className="font-semibold text-slate-900">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </MDBTypography>
              </div>
            ))}
          </div>
        </MDBCardBody>
      </MDBCard>

      <MDBBtn className="rounded-full px-6 py-3" onClick={onContinue}>
        Continue shopping
      </MDBBtn>
    </div>
  )
}
