import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { getOrders, exportOrders } from '../api'
import SectionHeader from '../components/SectionHeader'
import { MDBTypography, MDBBtn } from 'mdb-react-ui-kit'

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
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <MDBTypography className="text-slate-500">Veuillez vous connecter pour voir vos commandes.</MDBTypography>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Mes commandes" subtitle="Consultez l'historique de vos achats." />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MDBTypography className="text-sm text-slate-500">Vous pouvez exporter votre historique de commandes au format CSV.</MDBTypography>
        <MDBBtn color="primary" size="sm" disabled={!orders.length || exporting} onClick={handleExport}>
          {exporting ? 'Exportation…' : 'Exporter les commandes'}
        </MDBBtn>
      </div>

      {loading && <MDBTypography className="text-sm text-slate-500">Chargement des commandes…</MDBTypography>}
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {orders.length === 0 && !loading ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
          <MDBTypography>Aucune commande trouvée pour le moment.</MDBTypography>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Commande #{order.id}</div>
                  <div className="text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">${order.totalAmount.toFixed(2)}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Items</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{order.items.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
