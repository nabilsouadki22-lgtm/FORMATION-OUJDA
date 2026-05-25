import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../AuthContext'
import { CartContext } from '../CartContext'
import { getProducts } from '../api'
import SectionHeader from '../components/SectionHeader'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import { MDBInput } from 'mdb-react-ui-kit'

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const { user } = useContext(AuthContext)
  const { addItem } = useContext(CartContext)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      product.name.toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-br from-cyan-50 via-slate-50 to-violet-50 p-8 shadow-2xl shadow-slate-200/60">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Apprentissage et carrière
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Formations pour étudiants et professeurs à Oujda
            </h1>
            <p className="max-w-2xl text-slate-600">
              Découvrez des cours ciblés, gérez vos inscriptions, et facilitez l'enseignement avec une interface moderne et sécurisée.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button onClick={() => (window.location.hash = '#courses')}>
                Voir les cours
              </Button>
              <Button variant="secondary" onClick={() => (window.location.hash = '#courses')}>
                Cours enseignants
              </Button>
              <Button variant="outline" onClick={() => (window.location.hash = '#cart')} className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                Voir le panier
              </Button>
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
              alt="Étudiants en formation"
              className="h-[460px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Nouveaux parcours</p>
              <h2 className="mt-2 text-2xl font-semibold">Idéal pour étudiants ambitieux</h2>
              <p className="mt-2 text-sm text-cyan-100/90">Choisissez votre voie, créez votre emploi du temps et suivez votre progression chaque semaine.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/60 border border-slate-200">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pour les étudiants & professeurs</p>
          <h2 className="text-3xl font-semibold text-slate-900">Fonctionnalités selon votre rôle</h2>
          <p className="max-w-3xl text-slate-600">
            Une plateforme qui s'adapte aux besoins des étudiants en quête de formation et des professeurs qui souhaitent publier et gérer leurs cours.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
              alt="Etudiant utilisant la plateforme"
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Étudiants</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Apprendre facilement</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>• Parcours de cours clairs et accessibles</li>
                <li>• Inscription simplifiée aux formations</li>
                <li>• Paiement sécurisé et suivi des commandes</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.hash = '#courses')}>Explorer</Button>
                <Button variant="secondary">Voir mes inscriptions</Button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80"
              alt="Professeur préparant un cours"
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Professeurs</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Enseigner avec impact</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>• Créer et publier facilement des cours</li>
                <li>• Suivre vos étudiants et leurs inscriptions</li>
                <li>• Analyser les performances de vos formations</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.hash = '#courses')}>Créer un cours</Button>
                <Button variant="secondary">Gérer mes cours</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Produits"
          subtitle={user ? `Connecté en tant que ${user.email}` : 'Parcourez les produits et ajoutez-les à votre panier.'}
        />
        <div className="w-full max-w-md">
          <MDBInput
            className="rounded-full border-slate-200 bg-slate-50 text-slate-900 shadow-sm"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Rechercher un produit"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))
        )}
      </div>
    </div>
  )
}
