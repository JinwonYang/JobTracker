import { useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthPage } from './components/AuthPage.tsx'
import { JobFormModal } from './components/JobFormModal.tsx'
import { JobTable } from './components/JobTable.tsx'
import { SetupPage } from './components/SetupPage.tsx'
import { StatsBar } from './components/StatsBar.tsx'
import { useAuth } from './hooks/useAuth.ts'
import { useJobApplications } from './hooks/useJobApplications.ts'
import { isSupabaseConfigured } from './lib/supabase.ts'
import type { JobApplication } from './types/job.ts'
import { STAGES } from './types/job.ts'

export default function App() {
  if (!isSupabaseConfigured) {
    return <SetupPage />
  }

  return <AppContent />
}

function AppContent() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />
  }

  return <AuthenticatedApp user={user} signOut={signOut} />
}

function AuthenticatedApp({ user, signOut }: { user: User; signOut: () => Promise<void> }) {
  const {
    applications,
    loading: appsLoading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useJobApplications(user.id)

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<JobApplication | undefined>()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return applications.filter((app) => {
      const matchesSearch =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.position.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q) ||
        app.site.toLowerCase().includes(q) ||
        app.memo.toLowerCase().includes(q)
      const matchesStage = stageFilter === 'All' || app.stage === stageFilter
      return matchesSearch && matchesStage
    })
  }, [applications, search, stageFilter])

  const openAdd = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const openEdit = (app: JobApplication) => {
    setEditing(app)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const app = applications.find((a) => a.id === id)
    if (app && confirm(`Delete application for "${app.company}"?`)) {
      deleteApplication(id)
    }
  }

  const handleSubmit = (data: Parameters<typeof addApplication>[0]) => {
    if (editing) {
      updateApplication(editing.id, data)
    } else {
      addApplication(data)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">JobTracker</h1>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button
              onClick={() => signOut()}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {appsLoading ? (
          <p className="text-sm text-slate-500">Loading applications...</p>
        ) : (
          <>
            <StatsBar applications={applications} />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company, position, location, notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">All stages</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              {filtered.length !== applications.length && (
                <p className="mb-3 text-sm text-slate-500">
                  {filtered.length} of {applications.length} applications
                </p>
              )}
              <JobTable
                applications={filtered}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}
      </main>

      <JobFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
