import React from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children, title = 'Admin' }) {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}
