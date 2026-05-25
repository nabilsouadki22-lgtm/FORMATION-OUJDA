import React, { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { CartContext } from '../CartContext'
import { createCheckoutSession, createOrder } from '../api'
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTypography,
  MDBBtn
} from 'mdb-react-ui-kit'

export default function Cart({ onOrderConfirmed }) {
  const { cart, removeItem, updateQuantity, clearCart, totalAmount, totalItems } = useContext(CartContext)
  const { token, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [directLoading, setDirectLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    if (!user) {
      setError('Veuillez vous connecter pour passer à la caisse.')
      return
    }

    if (cart.length === 0) {
      setError('Votre panier est vide.')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const items = cart.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      const { url } = await createCheckoutSession(items, token)
      if (!url) {
        throw new Error('Impossible de créer la session de paiement Stripe.')
      }
      clearCart()
      window.location.assign(url)
    } catch (err) {
      setError(err?.error || err?.message || 'Le paiement a échoué. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDirectOrder() {
    if (!user) {
      setError('Veuillez vous connecter pour passer une commande.')
      return
    }

    if (cart.length === 0) {
      setError('Votre panier est vide.')
      return
    }

    setDirectLoading(true)
    setError(null)
    setMessage(null)

    try {
      const items = cart.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      const order = await createOrder(items, token)
      clearCart()
      if (typeof onOrderConfirmed === 'function') {
        onOrderConfirmed(order)
      }
    } catch (err) {
      setError(err?.error || err?.message || 'La commande a échoué. Veuillez réessayer.')
    } finally {
      setDirectLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <MDBCard className="rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <MDBCardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <MDBTypography tag="h5" className="mb-1 text-slate-900">
              Panier
            </MDBTypography>
            <MDBTypography className="text-slate-500 text-sm">
              {totalItems} article{totalItems !== 1 ? 's' : ''} dans le panier.
            </MDBTypography>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            Total ${totalAmount.toFixed(2)}
          </div>
        </MDBCardBody>
      </MDBCard>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Votre panier est vide.
        </div>
      ) : (
        <div className="space-y-5">
          {cart.map((item) => (
            <MDBCard key={item.productId} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <MDBTypography tag="h6" className="mb-1 text-slate-900">
                    {item.name}
                  </MDBTypography>
                  <MDBTypography className="text-slate-500 text-sm">
                    ${item.price.toFixed(2)} chacun
                  </MDBTypography>
                </div>
                <div className="flex items-center gap-3">
                  <MDBTypography className="text-slate-500 text-sm">Qté</MDBTypography>
                  <MDBInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    className="w-24 rounded-full border border-slate-200 bg-white px-3 py-2"
                  />
                </div>
                <div className="text-right">
                  <MDBTypography tag="h6" className="mb-3 text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </MDBTypography>
                  <MDBBtn color="danger" size="sm" outline className="rounded-full" onClick={() => removeItem(item.productId)}>
                    Supprimer
                  </MDBBtn>
                </div>
              </div>
            </MDBCard>
          ))}

          <MDBCard className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <MDBTypography className="text-slate-500 text-sm">Total de la commande</MDBTypography>
                <MDBTypography tag="h3" className="mt-2 text-slate-900">
                  ${totalAmount.toFixed(2)}
                </MDBTypography>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <MDBBtn className="rounded-full px-6 py-3" onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Traitement…' : 'Payer avec Stripe'}
                </MDBBtn>
                <MDBBtn color="secondary" className="rounded-full px-6 py-3" onClick={handleDirectOrder} disabled={directLoading}>
                  {directLoading ? 'Traitement…' : 'Commander sans Stripe'}
                </MDBBtn>
              </div>
            </div>
            <MDBTypography className="mt-4 text-sm text-slate-500">
              Vous préférez ne pas utiliser Stripe ? Passez une commande directe.
            </MDBTypography>
          </MDBCard>
        </div>
      )}
    </div>
  )
}
