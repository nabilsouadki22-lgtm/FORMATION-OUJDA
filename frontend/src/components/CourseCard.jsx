import React from 'react'
import { MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit'
import Button from './Button'

function getCourseImage(course) {
  const keywords = ['formation', 'classe', 'étudiant', 'éducation', 'professeur']
  const index = course.id % keywords.length
  return `https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80&sat=-100&blur=10&crop=entropy&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&${keywords[index]}`
}

export default function CourseCard({ course, onEnroll, disabled, enrolled }) {
  return (
    <MDBCard className="overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-xl shadow-slate-200/40">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={getCourseImage(course)}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4">
          <MDBTypography className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            {course.teacher?.role === 'teacher' ? 'Cours professeur' : 'Cours étudiant'}
          </MDBTypography>
        </div>
      </div>
      <MDBCardBody className="space-y-5 p-6">
        <div className="space-y-3">
          <MDBTypography tag="h6" className="text-slate-900">
            {course.title}
          </MDBTypography>
          <MDBTypography className="text-sm text-slate-500">
            {course.description || 'Les détails du cours arrivent bientôt.'}
          </MDBTypography>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              {course.studentCount || 0} étudiant{course.studentCount !== 1 ? 's' : ''}
            </span>
            <p className="text-xs text-slate-500">Enseignant : {course.teacher?.email || 'Inconnu'}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            ${course.price?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {onEnroll ? (
            <Button
              variant={enrolled ? 'secondary' : 'primary'}
              onClick={() => onEnroll(course)}
              disabled={disabled || enrolled}
            >
              {enrolled ? 'Inscrit' : "S'inscrire"}
            </Button>
          ) : (
            <MDBTypography className="text-sm font-medium text-slate-600">
              {course.studentCount || 0} étudiant{course.studentCount !== 1 ? 's' : ''}
            </MDBTypography>
          )}
          {enrolled && (
            <MDBTypography className="text-sm font-semibold text-emerald-700">Déjà inscrit</MDBTypography>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  )
}
