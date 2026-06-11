import React from 'react'

export default function Sidebar() {
  const links = [
    { key: 'orders', label: 'Commandes', hash: '#admin' },
    { key: 'users', label: 'Utilisateurs', hash: '#admin' }
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4">
      <div className="mb-6 font-bold text-slate-900">Administration</div>
      <nav className="space-y-2">
        {links.map((l) => (
          <a key={l.key} href={l.hash} className="block px-3 py-2 rounded hover:bg-slate-100 text-slate-700">
            {l.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
