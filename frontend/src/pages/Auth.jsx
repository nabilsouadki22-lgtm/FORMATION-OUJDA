import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import Button from '../components/Button'

export default function Auth({ adminMode = false }) {
  const { login, register } = useContext(AuthContext)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (adminMode && mode !== 'login') {
      setMode('login')
    }
  }, [adminMode, mode])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password, role)
    } catch (err) {
      setError(err?.error || (err?.errors && err.errors.map((x) => x.msg).join(', ')) || 'Requête échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="shadow-2xl rounded-[2rem] overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-5">
          <h4 className="mb-1">{adminMode ? 'Connexion admin' : mode === 'login' ? 'Connexion' : 'Inscription'}</h4>
          <div className="small opacity-90">
            {adminMode
              ? 'Connectez-vous avec un compte admin pour accéder au tableau de bord administratif.'
              : mode === 'login'
              ? 'Connectez-vous pour gérer vos commandes et vos cours.'
              : 'Créez un compte et commencez votre apprentissage.'}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-slate-700 mb-1">Email</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-slate-700 mb-1">Mot de passe</div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>

            {mode === 'register' && !adminMode && (
              <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">S'inscrire en tant que</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 cursor-pointer">
                    <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="accent-blue-600" />
                    <span>Étudiant</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3 cursor-pointer">
                    <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} className="accent-blue-600" />
                    <span>Enseignant</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="rounded-full px-6 py-3" disabled={loading}>
                {loading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
              </Button>
              {!adminMode && (
                <button type="button" className="btn-minimal text-slate-600" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Créer un compte' : 'Vous avez déjà un compte ? Connectez-vous'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
