import React, { useEffect, useState } from 'react'
import { getCourses } from '../api'
import CourseCard from '../components/CourseCard'
import SectionHeader from '../components/SectionHeader'
import {
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBBtn
} from 'mdb-react-ui-kit'

const roadmap = [
  {
    title: 'Débutant',
    description: 'Posez les bases du développement web avec HTML, CSS et JavaScript.',
    goals: ['Créer des pages web responsives', 'Comprendre le DOM', 'Écrire du JavaScript moderne']
  },
  {
    title: 'Intermédiaire',
    description: 'Monte en compétence avec React, API et gestion d’état.',
    goals: ['Construire des applications React', 'Intégrer des API', 'Gérer le routage et les formulaires']
  },
  {
    title: 'Avancé',
    description: 'Maîtrisez le back-end, les bases de données et le déploiement.',
    goals: ['Développer des API Node.js', 'Utiliser Prisma/SQL', 'Déployer sur le cloud']
  },
  {
    title: 'Certification',
    description: 'Préparez-vous à un projet final et à votre premier poste technique.',
    goals: ['Construire un portfolio', 'Présenter un projet complet', 'Postuler à des opportunités IT']
  }
]

export default function DevPath() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCourses() {
      setLoading(true)
      setError(null)
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (err) {
        setError(err?.error || 'Impossible de charger les cours.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl shadow-slate-900/30">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-cyan-100/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Parcours Dev
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Suivez un parcours complet en développement informatique
            </h1>
            <p className="max-w-3xl text-slate-200/90">
              Découvrez le catalogue des cours et la roadmap de formation pour devenir développeur web fullstack.
            </p>
            <div className="flex flex-wrap gap-3">
              <MDBBtn className="rounded-full px-6 py-3 text-slate-900" onClick={() => window.location.hash = '#courses'}>
                Explorer les cours
              </MDBBtn>
              <MDBBtn outline color="light" className="rounded-full px-6 py-3 text-white" onClick={() => window.location.hash = '#cart'}>
                Mon panier
              </MDBBtn>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-4 rounded-[1.5rem] overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
                alt="Parcours Dev"
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Programme</p>
              <p className="text-slate-200">Un parcours progressif, de l’initiation au déploiement, pensé pour les futurs développeurs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader title="Roadmap de formation" subtitle="Un chemin clair pour maîtriser le développement informatique." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((step) => (
            <MDBCard key={step.title} className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <MDBCardBody className="p-6">
                <MDBTypography tag="h5" className="mb-3 font-semibold text-slate-900">
                  {step.title}
                </MDBTypography>
                <MDBTypography className="mb-4 text-sm text-slate-500">
                  {step.description}
                </MDBTypography>
                <ul className="space-y-2 text-sm text-slate-600">
                  {step.goals.map((goal) => (
                    <li key={goal} className="flex gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader title="Catalogue de cours" subtitle="Tous les cours proposés sur le parcours Dev." />
          {loading && <span className="text-slate-500">Chargement des cours…</span>}
        </div>

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.length === 0 && !loading ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
              Aucune formation n'est disponible pour le moment.
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
