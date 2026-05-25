import React, { useState, useEffect, useContext } from 'react'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Courses from './pages/Courses'
import AdminOrders from './pages/AdminOrders'
import OrderConfirmation from './pages/OrderConfirmation'
import { AuthProvider, AuthContext } from './AuthContext'
import CartProvider, { CartContext } from './CartContext'
import { getOrder } from './api'
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBBtn,
  MDBTypography
} from 'mdb-react-ui-kit'

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '')
  const allowedPages = ['home', 'courses', 'cart', 'orders', 'admin', 'confirmation', 'auth']
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

  const navigate = (targetPage) => {
    const nextHash = `#${targetPage}`
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash
    } else {
      setPage(targetPage)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MDBNavbar light bgColor="white" className="shadow-sm border-b border-slate-200">
        <MDBContainer fluid className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MDBNavbarBrand className="fw-bold text-slate-900">Centre Formation Oujda</MDBNavbarBrand>
            <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 md:inline-flex">
              Centre de formation
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <MDBBtn color="link" size="sm" className="text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100" onClick={() => navigate('home')}>
              Accueil
            </MDBBtn>
            <MDBBtn color="link" size="sm" className="text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100" onClick={() => navigate('courses')}>
              Cours
            </MDBBtn>
            <MDBBtn color="link" size="sm" className="text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100" onClick={() => navigate('cart')}>
              Panier{totalItems > 0 ? ` (${totalItems})` : ''}
            </MDBBtn>
            <MDBBtn color="link" size="sm" className="text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100" onClick={() => navigate('orders')}>
              Mes commandes
            </MDBBtn>
            {user?.isAdmin && (
              <MDBBtn color="link" size="sm" className="text-slate-600 px-3 py-2 rounded-full hover:bg-slate-100" onClick={() => navigate('admin')}>
                Commandes admin
              </MDBBtn>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <MDBTypography className="text-slate-600 small mb-0">{user.email}</MDBTypography>
                <MDBBtn color="danger" size="sm" className="rounded-full px-4 py-2" onClick={() => { logout(); navigate('home') }}>
                  Déconnexion
                </MDBBtn>
              </>
            ) : (
              <MDBBtn className="rounded-full px-4 py-2" onClick={() => navigate('auth')}>
                Se connecter / S'inscrire
              </MDBBtn>
            )}
          </div>
        </MDBContainer>
      </MDBNavbar>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {message && (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 mb-6 text-blue-900">
            {message}
          </div>
        )}

        {page === 'auth' && !user ? (
          <Auth />
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
