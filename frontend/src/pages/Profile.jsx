import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { getOrders, getMyEnrollments, getMyCourses } from '../api'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import {
  MDBCard,
  MDBCardBody,
  MDBTypography
} from 'mdb-react-ui-kit'

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

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    async function loadProfileData() {
      setLoading(true)
      setError(null)

      try {
        const [ordersData, enrollmentsData, coursesData] = await Promise.all([
          getOrders(token),
          getMyEnrollments(token).catch(() => []),
          getMyCourses(token).catch(() => [])
        ])

        setOrders(ordersData)
        setEnrollments(enrollmentsData)
        setCourses(coursesData)
      } catch (err) {
        setError(err?.error || 'Impossible de charger les informations du profil')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [token])

  if (!user) {
    return (
      <div className="card-modern p-8 text-center glass-panel">
        <MDBTypography className="muted">Veuillez vous connecter pour consulter votre profil.</MDBTypography>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Mon profil" subtitle="Consultez vos commandes, inscriptions et cours publiés." />

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MDBCard className="card-modern">
          <MDBCardBody className="space-y-4 p-6">
            <div>
              <MDBTypography tag="h5" className="fw-semibold text-slate-900">Informations utilisateur</MDBTypography>
              <p className="text-sm text-slate-500">Géré par votre compte actuel.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Email</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{user.email}</MDBTypography>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Rôle</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{user.role}</MDBTypography>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Admin</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{user.isAdmin ? 'Oui' : 'Non'}</MDBTypography>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Commandes</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{orders.length}</MDBTypography>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="btn-pill" onClick={() => window.location.hash = '#orders'}>Voir mes commandes</Button>
              <Button variant="secondary" onClick={() => logout()}>Déconnexion</Button>
            </div>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="card-modern">
          <MDBCardBody className="space-y-4 p-6">
            <MDBTypography tag="h5" className="fw-semibold text-slate-900">Résumé rapide</MDBTypography>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Inscrits</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{enrollments.length}</MDBTypography>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <MDBTypography className="text-sm text-slate-500">Cours publiés</MDBTypography>
                <MDBTypography className="mt-2 font-semibold text-slate-900">{courses.length}</MDBTypography>
              </div>
            </div>
            <MDBTypography className="text-sm text-slate-500">Données mises à jour chaque fois que vous accédez à votre profil.</MDBTypography>
          </MDBCardBody>
        </MDBCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MDBCard className="card-modern">
          <MDBCardBody className="p-6">
            <MDBTypography tag="h5" className="fw-semibold mb-4 text-slate-900">Mes commandes récentes</MDBTypography>
            {loading ? (
              <p className="text-slate-500">Chargement…</p>
            ) : orders.length === 0 ? (
              <p className="text-slate-500">Aucune commande trouvée.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">Commande #{order.id}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-700">{statusLabel(order.status)}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Montant total : ${order.totalAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="card-modern">
          <MDBCardBody className="p-6">
            <MDBTypography tag="h5" className="fw-semibold mb-4 text-slate-900">Activité</MDBTypography>
            {loading ? (
              <p className="text-slate-500">Chargement…</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Inscriptions</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{enrollments.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Cours publiés</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{courses.length}</p>
                </div>
              </div>
            )}
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
  )
}
