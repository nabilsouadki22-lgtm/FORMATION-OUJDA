import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { getCourses, getMyEnrollments, getMyCourses, createCourse, enrollCourse } from '../api'
import CourseCard from '../components/CourseCard'
import SectionHeader from '../components/SectionHeader'
import {
  MDBBtn,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBTypography
} from 'mdb-react-ui-kit'

export default function Courses() {
  const { user, token } = useContext(AuthContext)
  const [courses, setCourses] = useState([])
  const [myEnrollments, setMyEnrollments] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '' })

  const enrolledCourseIds = useMemo(() => myEnrollments.map((item) => item.courseId), [myEnrollments])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const coursesData = await getCourses()
      setCourses(coursesData)
      if (token) {
        if (user?.role === 'student' || user?.isAdmin) {
          const enrollments = await getMyEnrollments(token)
          setMyEnrollments(enrollments)
        }
        if (user?.role === 'teacher' || user?.isAdmin) {
          const teacherCourses = await getMyCourses(token)
          setMyCourses(teacherCourses)
        }
      }
    } catch (err) {
      setError(err?.error || 'Impossible de charger les cours')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user, token])

  async function handleEnroll(course) {
    if (!token) {
      setError('Veuillez vous connecter pour vous inscrire aux cours.')
      return
    }
    setMessage(null)
    setError(null)
    try {
      await enrollCourse(course.id, token)
      setMessage(`Inscription réussie au cours « ${course.title} »`)
      loadData()
    } catch (err) {
      setError(err?.error || "L'inscription a échoué")
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!token) return
    if (!newCourse.title.trim()) {
      setError('Le titre du cours est requis')
      return
    }
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      await createCourse({
        title: newCourse.title,
        description: newCourse.description,
        price: parseFloat(newCourse.price) || 0
      }, token)
      setNewCourse({ title: '', description: '', price: '' })
      setMessage('Cours créé avec succès')
      loadData()
    } catch (err) {
      setError(err?.error || 'Impossible de créer le cours')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl shadow-slate-900/20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Cours & Formations
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Découvrez des parcours adaptés aux étudiants et aux professeurs
            </h1>
            <p className="max-w-3xl text-slate-200/90">
              Explorez des cours inspirants, publiez vos propres formations ou suivez votre progression avec un espace dédié.
            </p>
            <div className="flex flex-wrap gap-3">
              <MDBBtn color="light" className="rounded-full px-6 py-3 text-slate-900">
                Voir les cours
              </MDBBtn>
              <MDBBtn outline color="light" className="rounded-full px-6 py-3 text-white">
                Inscription rapide
              </MDBBtn>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80"
              alt="Students learning online"
              className="h-[380px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 text-slate-100">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Étudiants et professeurs</p>
              <p className="mt-2 text-lg font-semibold">Un espace moderne pour apprendre et enseigner.</p>
            </div>
          </div>
        </div>
      </section>

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

      {user?.role === 'teacher' || user?.isAdmin ? (
        <MDBCard className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <MDBCardBody className="p-6">
            <MDBTypography tag="h5" className="mb-4 text-slate-900">
              Créer un nouveau cours
            </MDBTypography>
            <form className="space-y-4" onSubmit={handleCreate}>
              <MDBInput
                label="Titre du cours"
                value={newCourse.title}
                onChange={(e) => setNewCourse((prev) => ({ ...prev, title: e.target.value }))}
              />
              <MDBInput
                label="Description"
                textarea
                rows={3}
                value={newCourse.description}
                onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))}
              />
              <MDBInput
                label="Prix"
                type="number"
                step="0.01"
                value={newCourse.price}
                onChange={(e) => setNewCourse((prev) => ({ ...prev, price: e.target.value }))}
              />
              <MDBBtn type="submit" disabled={saving} className="rounded-full px-6 py-3">
                {saving ? 'Enregistrement…' : 'Créer le cours'}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      ) : null}

      {user?.role === 'student' || user?.isAdmin ? (
        <MDBCard className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <MDBCardBody className="p-6">
            <MDBTypography tag="h5" className="mb-4 text-slate-900">
              Mes inscriptions
            </MDBTypography>
            {myEnrollments.length === 0 ? (
              <p className="text-slate-600">Vous n'êtes inscrit à aucun cours pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {myEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{enrollment.course?.title}</p>
                        <p className="text-sm text-slate-500">Enseignant : {enrollment.course?.teacher?.email}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-700">
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MDBCardBody>
        </MDBCard>
      ) : null}

      {user?.role === 'teacher' || user?.isAdmin ? (
        <MDBCard className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <MDBCardBody className="p-6">
            <MDBTypography tag="h5" className="mb-4 text-slate-900">
              Mes cours publiés
            </MDBTypography>
            {myCourses.length === 0 ? (
              <p className="text-slate-600">Vous n'avez encore publié aucun cours.</p>
            ) : (
              <div className="space-y-3">
                {myCourses.map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{course.title}</p>
                        <p className="text-sm text-slate-500">{course.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-700">
                        {course.studentCount || 0} étudiant{course.studentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MDBCardBody>
        </MDBCard>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            title="Cours disponibles"
            subtitle="Découvrez les cours du centre et inscrivez-vous selon vos objectifs."
          />
          {loading && <span className="text-slate-500">Chargement des cours…</span>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.length === 0 && !loading ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
              Aucun cours disponible pour le moment.
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={user && user.role !== 'teacher' ? () => handleEnroll(course) : null}
                disabled={!user || user.role === 'teacher'}
                enrolled={enrolledCourseIds.includes(course.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
