import { useEffect, useState } from 'react'
import type { JobApplication } from '../types/job'
import { StatusBadge } from './StatusBadge'

interface JobTableProps {
  applications: JobApplication[]
  onEdit: (app: JobApplication) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function siteHref(site: string) {
  return site.startsWith('http') ? site : `https://${site}`
}

function SiteLinkButton({ site }: { site: string }) {
  return (
    <a
      href={siteHref(site)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
    >
      <ExternalLinkIcon />
      Open
    </a>
  )
}

export function JobTable({ applications, onEdit, onDelete }: JobTableProps) {
  const [viewingNote, setViewingNote] = useState<JobApplication | null>(null)

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-base font-medium text-slate-600">No applications yet</p>
        <p className="mt-1 text-sm text-slate-400">Click &apos;Add Application&apos; above to get started</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Company</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Position</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Salary</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Site</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Stage</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Notes</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Applied</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/60">
                  <td className="px-4 py-3.5 font-medium text-slate-900">{app.company}</td>
                  <td className="px-4 py-3.5 text-slate-600">{app.position || '—'}</td>
                  <td className="px-4 py-3.5 text-slate-600">{app.salary || '—'}</td>
                  <td className="px-4 py-3.5 text-slate-600">{app.location || '—'}</td>
                  <td className="px-4 py-3.5">
                    {app.site ? (
                      <SiteLinkButton site={app.site} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge stage={app.stage} />
                  </td>
                  <td className="px-4 py-3.5">
                    {app.memo ? (
                      <ActionButton onClick={() => setViewingNote(app)} label="View notes">
                        <NoteIcon />
                      </ActionButton>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                    {formatDate(app.appliedAt)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <ActionButton onClick={() => onEdit(app)} label="Edit">
                        <EditIcon />
                      </ActionButton>
                      <ActionButton onClick={() => onDelete(app.id)} label="Delete" danger>
                        <TrashIcon />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">{app.company}</h3>
                {app.position && (
                  <p className="mt-0.5 text-sm text-slate-500">{app.position}</p>
                )}
              </div>
              <StatusBadge stage={app.stage} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {app.salary && (
                <>
                  <dt className="text-slate-400">Salary</dt>
                  <dd className="text-slate-700">{app.salary}</dd>
                </>
              )}
              {app.location && (
                <>
                  <dt className="text-slate-400">Location</dt>
                  <dd className="text-slate-700">{app.location}</dd>
                </>
              )}
              {app.site && (
                <>
                  <dt className="text-slate-400">Site</dt>
                  <dd>
                    <SiteLinkButton site={app.site} />
                  </dd>
                </>
              )}
              <dt className="text-slate-400">Applied</dt>
              <dd className="text-slate-700">{formatDate(app.appliedAt)}</dd>
            </dl>

            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              {app.memo && (
                <button
                  onClick={() => setViewingNote(app)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <NoteIcon /> Notes
                </button>
              )}
              <button
                onClick={() => onEdit(app)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <EditIcon /> Edit
              </button>
              <button
                onClick={() => onDelete(app.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <TrashIcon /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewingNote && (
        <NoteModal app={viewingNote} onClose={() => setViewingNote(null)} />
      )}
    </>
  )
}

function NoteModal({ app, onClose }: { app: JobApplication; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
            <p className="text-sm text-slate-500">{app.company}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-6 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{app.memo}</p>
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  label,
  danger,
  children,
}: {
  onClick: () => void
  label: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`rounded-lg p-1.5 ${
        danger
          ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
    >
      {children}
    </button>
  )
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}
