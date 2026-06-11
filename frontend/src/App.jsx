import React, { useState, useEffect, useContext } from 'react'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Courses from './pages/Courses'
import DevPath from './pages/DevPath'
import Profile from './pages/Profile'
import AdminOrders from './pages/AdminOrders'
import OrderConfirmation from './pages/OrderConfirmation'
import { AuthProvider, AuthContext } from './AuthContext'
import CartProvider, { CartContext } from './CartContext'
import { getOrder } from './api'


function getPageFromHash() {
  const hash = window.location.hash.replace('#', '')
  const allowedPages = ['home', 'courses', 'devpath', 'cart', 'orders', 'admin', 'confirmation', 'auth', 'profile']
  return allowedPages.includes(hash) ? hash : 'home'
}

function InnerApp() {
  const { user, logout, token } = useContext(AuthContext)
  const { totalItems } = useContext(CartContext)
  const [page, setPage] = useState(getPageFromHash)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('checkoutSuccess') === 'true'
    const canceled = params.get('checkoutCanceled') === 'true'
    const orderId = params.get('orderId')

    if (!success && !canceled) return

    if (success && orderId) {
      if (!token) {
        setPage('home')
        window.location.hash = '#home'
        setMessage('Paiement effectué. Connectez-vous pour voir les détails de la commande.')
      } else {
        setPage('confirmation')
        window.location.hash = '#confirmation'
        setMessage(null)
        getOrder(orderId, token)
          .then((order) => setConfirmedOrder(order))
          .catch((err) => setMessage(err?.error || 'Impossible de charger la commande confirmée.'))
      }
    }

    if (canceled) {
      setPage('home')
      window.location.hash = '#home'
      setMessage('Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.')
    }

    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
  }, [token])

  useEffect(() => {
    const updatePageFromHash = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', updatePageFromHash)
    return () => window.removeEventListener('hashchange', updatePageFromHash)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const navigate = (targetPage) => {
    const nextHash = `#${targetPage}`
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash
    } else {
      setPage(targetPage)
    }
  }

  const navItems = [
    { key: 'home', label: 'Accueil' },
    { key: 'courses', label: 'Cours' },
    { key: 'devpath', label: 'Parcours Dev' },
    { key: 'cart', label: `Panier${totalItems > 0 ? ` (${totalItems})` : ''}` },
    { key: 'orders', label: 'Mes commandes' }
  ]

  const navClass = (itemKey) =>
    `text-sm font-medium px-3 py-2 transition ${page === itemKey ? 'text-cyan-600 underline decoration-2 underline-offset-4 font-semibold' : 'text-slate-600 hover:text-cyan-600'}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 hero-gradient">
      <header className="shadow-md border-b border-slate-200/70 backdrop-blur-xl bg-white/90">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-slate-900 text-lg">
              <span>Centre Formation</span>
              <span className="ml-1 text-cyan-600">Oujda</span>
            </div>
            <span className="hidden rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 md:inline-flex">
              Plateforme professionnelle IT
            </span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((nav) => (
              <button key={nav.key} className={navClass(nav.key)} onClick={() => navigate(nav.key)}>
                {nav.label}
              </button>
            ))}
            {user && (
              <button className={`${navClass('profile')} text-sm`} onClick={() => navigate('profile')}>
                Mon profil
              </button>
            )}
            {user?.isAdmin && (
              <button className={`${navClass('admin')} text-sm`} onClick={() => navigate('admin')}>
                Admin
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <div className="text-slate-700 small mb-0 muted">{user.email}</div>
                <button className="btn-minimal" onClick={() => { logout(); navigate('home') }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <button className="btn-minimal" onClick={() => navigate('auth')}>
                Se connecter / S'inscrire
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        {message && (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 mb-6 text-blue-900">
            {message}
          </div>
        )}

        {page === 'auth' && !user ? (
          <Auth />
        ) : page === 'admin' && !user ? (
          <Auth adminMode />
        ) : page === 'admin' && user && !user.isAdmin ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
            <MDBTypography tag="h4" className="fw-semibold mb-2 text-rose-900">
              Accès refusé
            </MDBTypography>
            <MDBTypography className="text-sm">
              Vous devez être administrateur pour accéder à cette page. Connectez-vous avec un compte admin.
            </MDBTypography>
          </div>
        ) : page === 'admin' && user?.isAdmin ? (
          <AdminOrders />
        ) : page === 'orders' && user ? (
          <Orders />
        ) : page === 'courses' ? (
          <Courses />
        ) : page === 'cart' ? (
          <Cart
            onOrderConfirmed={(order) => {
              setConfirmedOrder(order)
              setPage('confirmation')
            }}
          />
        ) : page === 'confirmation' ? (
          <OrderConfirmation
            order={confirmedOrder}
            onContinue={() => navigate('home')}
          />
        ) : page === 'profile' ? (
          <Profile />
        ) : page === 'devpath' ? (
          <DevPath />
        ) : (
          <Home />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InnerApp />
      </CartProvider>
    </AuthProvider>
  )
}
