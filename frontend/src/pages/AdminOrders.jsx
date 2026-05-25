import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import {
  MDBCard,
  MDBTypography,
  MDBBtn
} from 'mdb-react-ui-kit'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled']

function statusBadge(status) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'processing':
      return 'bg-sky-100 text-sky-700'
    case 'cancelled':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

function statusLabel(status) {
  switch (status) {
    case 'completed':
      return 'Terminé'
    case 'processing':
      return 'En traitement'
    case 'cancelled':
      return 'Annulé'
    default:
      return 'En attente'
  }
}

export default function AdminOrders() {
  const { token } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setOrders([])
      setSelectedOrder(null)
      return
    }
    loadOrders()
  }, [token])

  async function loadOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) throw await res.json()
      const data = await res.json()
      setOrders(data)
      if (data[0]) {
        setSelectedOrder((prev) => (prev && data.find((o) => o.id === prev.id)) ?? data[0])
      }
    } catch (err) {
      setError(err?.error || 'Impossible de charger les commandes')
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId, nextStatus) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      })
      if (!res.ok) throw await res.json()
      const updated = await res.json()
      setSelectedOrder(updated)
      setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)))
    } catch (err) {
      setError(err?.error || 'Impossible de mettre à jour le statut')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <MDBTypography tag="h4" className="fw-semibold mb-2 text-slate-900">
          Commandes admin
        </MDBTypography>
        <MDBTypography className="text-sm text-slate-500">
          Gérez les commandes de tous les utilisateurs.
        </MDBTypography>
      </div>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}
      {loading && <MDBTypography className="text-slate-500">Chargement...</MDBTypography>}

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <MDBTypography tag="h6" className="mb-4 text-slate-900">
            Commandes
          </MDBTypography>
          {orders.length === 0 ? (
            <MDBTypography className="text-slate-500">Aucune commande pour le moment.</MDBTypography>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={`w-full rounded-3xl border p-4 text-left transition ${selectedOrder?.id === order.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                  onClick={() => {
                    setSelectedOrder(order)
                    setStatus(order.status)
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <MDBTypography className="fw-medium text-slate-900">Commande #{order.id}</MDBTypography>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusBadge(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <MDBTypography className="mt-2 text-sm text-slate-500">{order.user?.email}</MDBTypography>
                  <MDBTypography className="mt-1 text-sm font-semibold text-slate-900">${order.totalAmount.toFixed(2)}</MDBTypography>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <MDBTypography tag="h6" className="mb-4 text-slate-900">
            Détails de la commande
          </MDBTypography>
          {!selectedOrder ? (
            <MDBTypography className="text-slate-500">Sélectionnez une commande pour voir les détails.</MDBTypography>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-500">Commande</MDBTypography>
                  <MDBTypography className="mt-2 font-semibold text-slate-900">#{selectedOrder.id}</MDBTypography>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-500">Client</MDBTypography>
                  <MDBTypography className="mt-2 font-semibold text-slate-900">{selectedOrder.user?.email}</MDBTypography>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-500">Created</MDBTypography>
                  <MDBTypography className="mt-2 text-slate-900">{new Date(selectedOrder.createdAt).toLocaleString()}</MDBTypography>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-500">Total</MDBTypography>
                  <MDBTypography className="mt-2 font-semibold text-slate-900">${selectedOrder.totalAmount.toFixed(2)}</MDBTypography>
                </div>
              </div>

              <div className="space-y-3">
                <MDBTypography className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Status</MDBTypography>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="form-select rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {statusLabel(option)}
                    </option>
                  ))}
                </select>
                <MDBBtn className="rounded-full px-6 py-3" onClick={() => updateOrderStatus(selectedOrder.id, status)} disabled={loading}>
                  Mettre à jour le statut
                </MDBBtn>
              </div>

              <MDBCard className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <MDBTypography className="text-sm uppercase tracking-[0.18em] text-slate-500">Items</MDBTypography>
                <div className="mt-4 space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm">
                      <div>
                        <MDBTypography className="font-semibold text-slate-900">{item.product?.name}</MDBTypography>
                        <MDBTypography className="text-sm text-slate-500">Qty {item.quantity} × ${item.priceAtPurchase.toFixed(2)}</MDBTypography>
                      </div>
                      <MDBTypography className="text-sm font-semibold text-slate-900">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </MDBTypography>
                    </div>
                  ))}
                </div>
              </MDBCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
