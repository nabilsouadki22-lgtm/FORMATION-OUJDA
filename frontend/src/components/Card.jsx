import React from 'react'

export default function Card({ children, className = '' }) {
  return <div className={`rounded bg-white p-4 shadow ${className}`}>{children}</div>
}
