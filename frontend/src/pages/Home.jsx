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

  const navigate = (target) => {
    window.location.hash = `#${target}`
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[2.5rem] bg-white/95 p-8 shadow-card border border-slate-200/60 glass-panel">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Plateforme de formation professionnelle
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              L'écosystème d'apprentissage informatique à Oujda
            </h1>
            <p className="max-w-2xl text-slate-600 text-lg leading-8">
              Accédez à des parcours tech, gérez vos commandes, suivez vos cours, et lancez votre carrière avec une interface moderne pensée pour les étudiants et formateurs.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Button onClick={() => navigate('courses')}>
                Voir les cours
              </Button>
              <Button variant="secondary" onClick={() => navigate('devpath')}>
                Parcours Dev
              </Button>
              <Button variant="outline" onClick={() => navigate('cart')}>
                Panier
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-300/20">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
              alt="Formation informatique moderne"
              className="h-[460px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Parcours d'excellence</p>
              <h2 className="mt-2 text-2xl font-semibold">Apprenez, pratiquez, maîtrisez</h2>
              <p className="mt-2 text-sm text-cyan-100/90">Une expérience immersive pour les futurs développeurs et formateurs IT.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-900/20 border border-white/10 glass-panel">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Parcours Dev</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Votre chemin vers le développement web et logiciel</h2>
            <p className="max-w-3xl text-slate-200">
              Suivez un parcours structuré qui couvre l’initiation, la pratique avec React, le développement de back-end, et la préparation au marché IT.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                onClick={() => (window.location.hash = '#devpath')}
              >
                Découvrir le parcours
              </button>
              <button
                className="rounded-full border border-cyan-300 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => (window.location.hash = '#courses')}
              >
                Voir les cours associés
              </button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-4 overflow-hidden rounded-[1.5rem] bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
                alt="Roadmap développement"
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Roadmap</p>
              <h3 className="text-xl font-semibold text-white">4 étapes clés vers votre premier projet</h3>
              <p className="text-sm text-slate-200">
                Initiation → Frontend → Backend → Projet final. Un parcours pensé pour devenir développeur avec confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/60 border border-slate-200">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pour les étudiants & professeurs</p>
          <h2 className="text-3xl font-semibold text-slate-900">Fonctionnalités selon votre rôle</h2>
          <p className="max-w-3xl text-slate-600">
            Une plateforme spécialisée en développement informatique, adaptée aux étudiants qui veulent coder et aux professeurs qui veulent enseigner le digital.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-modern overflow-hidden border border-slate-200/70 bg-white/95 shadow-xl">
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
                <li>• Inscription simplifiée aux formations en développement informatique</li>
                <li>• Paiement sécurisé et suivi des commandes</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.hash = '#courses')}>Explorer</Button>
                <Button variant="secondary">Voir mes inscriptions</Button>
              </div>
            </div>
          </div>

          <div className="card-modern overflow-hidden border border-slate-200/70 bg-white/95 shadow-xl">
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
                <li>• Analyser les performances de vos parcours de développement</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => (window.location.hash = '#courses')}>Créer un cours</Button>
                <Button variant="secondary">Gérer mes cours</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Frontend moderne',
            description: 'HTML, CSS, JavaScript, React et Vite pour créer des interfaces interactives.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80'
          },
          {
            title: 'Back-end & API',
            description: 'Node.js, Express et bases de données pour construire des API robustes.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
          },
          {
            title: 'Cloud & déploiement',
            description: 'Mettez vos applications en production et apprenez les bonnes pratiques DevOps.',
            image: 'https://images.unsplash.com/photo-1515263487990-61c1d977a043?auto=format&fit=crop&w=900&q=80'
          }
        ].map((item) => (
          <div key={item.title} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-800/20">
            <div className="relative h-56 overflow-hidden">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
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
