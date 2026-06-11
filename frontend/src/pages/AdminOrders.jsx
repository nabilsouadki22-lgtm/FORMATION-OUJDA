import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import {
  MDBCard,
  MDBTypography,
  MDBBtn
} from 'mdb-react-ui-kit'
import Button from '../components/Button'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled']
const ROLE_OPTIONS = ['student', 'teacher']

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
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setOrders([])
      setSelectedOrder(null)
      setUsers([])
      return
    }
    if (tab === 'orders') {
      loadOrders()
    } else {
      loadUsers()
    }
  }, [token, tab])

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

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) throw await res.json()
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err?.error || 'Impossible de charger les utilisateurs')
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

  async function updateUser(userId, updates) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw await res.json()
      const updated = await res.json()
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)))
    } catch (err) {
      setError(err?.error || 'Impossible de mettre à jour l’utilisateur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Tableau de bord admin">
      <div className="space-y-6">
        <div className="card-modern glass-panel p-6">
          <MDBTypography tag="h4" className="fw-semibold mb-2 text-slate-900">
            Tableau de bord admin
          </MDBTypography>
          <MDBTypography className="text-sm text-slate-500">
            Gérez les commandes, les utilisateurs et l’accès admin depuis un seul endroit.
          </MDBTypography>
        </div>

        <div className="flex flex-wrap gap-3">
          {['orders', 'users'].map((item) => (
            <button
              key={item}
              type="button"
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${tab === item ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              onClick={() => setTab(item)}
            >
              {item === 'orders' ? 'Commandes' : 'Utilisateurs'}
            </button>
          ))}
        </div>

        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}
        {loading && <MDBTypography className="text-slate-500">Chargement...</MDBTypography>}

        {tab === 'orders' ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
            <div className="card-modern p-4">
              <MDBTypography tag="h6" className="mb-4 text-slate-900">Commandes</MDBTypography>
              {orders.length === 0 ? (
                <MDBTypography className="text-slate-500">Aucune commande pour le moment.</MDBTypography>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <button
                    key={order.id}
                    type="button"
                    className={`w-full text-left rounded-[1.5rem] p-4 transition ${selectedOrder?.id === order.id ? 'bg-slate-100 shadow-xl' : 'bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5'}`}
                    onClick={() => { setSelectedOrder(order); setStatus(order.status) }}
                  >
                      <div className="flex items-center justify-between">
                        <div>
                          <MDBTypography className="fw-medium text-slate-900">Commande #{order.id}</MDBTypography>
                          <div className="text-sm muted">{order.user?.email}</div>
                        </div>
                        <div className={`text-sm font-semibold ${statusBadge(order.status)}`}>{statusLabel(order.status)}</div>
                      </div>
                      <div className="mt-2 text-sm accent font-semibold">${order.totalAmount.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="card-modern p-6">
              <MDBTypography tag="h6" className="mb-4 text-slate-900">Détails de la commande</MDBTypography>
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
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-select rounded-md border border-slate-200 bg-white px-3 py-2">
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
        ) : (
          <div className="card-modern p-6">
            <MDBTypography tag="h6" className="mb-4 text-slate-900">
              Gestion des utilisateurs
            </MDBTypography>
            {users.length === 0 ? (
              <MDBTypography className="text-slate-500">Aucun utilisateur trouvé.</MDBTypography>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto]">
                    <div>
                      <MDBTypography className="font-semibold text-slate-900">{user.email}</MDBTypography>
                      <MDBTypography className="text-sm text-slate-500">Role : {user.role}</MDBTypography>
                    </div>
                    <div className="grid gap-2">
                      <select
                        value={user.role}
                        onChange={(event) => updateUser(user.id, { role: event.target.value })}
                        className="form-select rounded-3xl border border-slate-200 bg-white px-4 py-3"
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={(event) => updateUser(user.id, { isAdmin: event.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        Admin
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
