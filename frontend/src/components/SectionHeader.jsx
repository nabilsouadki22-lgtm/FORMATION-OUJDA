import React from 'react'
import { MDBTypography } from 'mdb-react-ui-kit'

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6 space-y-2">
      <MDBTypography tag="h4" className="fw-semibold text-slate-900">
        {title}
      </MDBTypography>
      {subtitle && (
        <MDBTypography className="text-slate-500">
          {subtitle}
        </MDBTypography>
      )}
    </div>
  )
}
