import React from 'react'
import Button from './Button'

function getCourseImage(course) {
  const queries = ['code', 'developer', 'programming', 'computer', 'web development', 'tech workspace']
  const key = String(course.id || course.title).slice(-1)
  const index = Number(key) % queries.length
  return `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80&${queries[index]}`
}

function getCourseCategory(course) {
  const title = (course.title || '').toLowerCase()
  if (title.includes('react') || title.includes('javascript')) return 'Frontend'
  if (title.includes('node') || title.includes('api') || title.includes('backend')) return 'Backend'
  if (title.includes('database') || title.includes('prisma') || title.includes('sql')) return 'Base de données'
  if (title.includes('cloud') || title.includes('déploiement')) return 'Cloud'
  return 'Développement'
}

export default function CourseCard({ course, onEnroll, onView, disabled, enrolled }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img
          src={getCourseImage(course)}
          alt={course.title}
          className="h-full w-full object-cover transition duration-700 ease-out hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
          {getCourseCategory(course)}
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h5 className="text-slate-900 font-semibold text-lg">{course.title}</h5>
          <p className="mt-2 text-sm text-slate-500 line-clamp-3">{course.description || 'Un aperçu rapide du contenu du cours.'}</p>
        </div>
        <div className="mb-5 flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{course.studentCount || 0} inscrit{course.studentCount !== 1 ? 's' : ''}</span>
          <span className="font-semibold text-slate-900">${course.price?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => onEnroll?.(course)} disabled={disabled || enrolled} className="min-w-[130px]">
            {enrolled ? 'Inscrit' : "S'inscrire"}
          </Button>
          <Button variant="outline" onClick={() => onView?.(course)}>
            Plus de détails
          </Button>
          {enrolled && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Déjà inscrit
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
