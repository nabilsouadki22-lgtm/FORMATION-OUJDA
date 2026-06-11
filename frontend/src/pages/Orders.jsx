import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { getOrders, exportOrders } from '../api'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import { MDBTypography } from 'mdb-react-ui-kit'

function statusColor(status) {
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

export default function Orders() {
  const { token, user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    setLoading(true)
    setError(null)

    getOrders(token)
      .then(setOrders)
      .catch((err) => setError(err?.error || 'Impossible de charger les commandes'))
      .finally(() => setLoading(false))
  }, [token])

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await exportOrders(token)
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'orders.csv'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.error || 'Échec de l’exportation des commandes.')
    } finally {
      setExporting(false)
    }
  }

  if (!user) {
    return (
      <div className="card-modern glass-panel p-8 text-center">
        <MDBTypography className="text-slate-500">Veuillez vous connecter pour voir vos commandes.</MDBTypography>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Mes commandes" subtitle="Consultez l'historique de vos achats." />

      <div className="card-modern glass-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <MDBTypography className="text-sm muted">Vous pouvez exporter votre historique de commandes au format CSV.</MDBTypography>
          <Button className="btn-pill" onClick={handleExport} disabled={!orders.length || exporting}>{exporting ? 'Exportation…' : 'Exporter'}</Button>
        </div>
      </div>

      {loading && <MDBTypography className="text-sm text-slate-500">Chargement des commandes…</MDBTypography>}
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {orders.length === 0 && !loading ? (
        <div className="card-modern glass-panel p-8 text-center">
          <MDBTypography className="muted">Aucune commande trouvée pour le moment.</MDBTypography>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card-modern p-5 transition duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-slate-900">Commande #{order.id}</div>
                  <div className="text-sm muted">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="muted text-sm">Items: {order.items.length}</div>
                <div className="accent font-semibold text-lg">${order.totalAmount.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
