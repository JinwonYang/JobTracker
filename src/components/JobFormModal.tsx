import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { JobApplication, JobFormData } from '../types/job.ts'
import { EMPTY_FORM, STAGES, fromDateInputValue, todayAppliedAt, toDateInputValue } from '../types/job.ts'

interface JobFormModalProps {
  open: boolean
  initial?: JobApplication
  onClose: () => void
  onSubmit: (data: JobFormData) => void
}

function toFormData(job?: JobApplication): JobFormData {
  if (!job) return { ...EMPTY_FORM, appliedAt: todayAppliedAt() }
  return {
    company: job.company,
    site: job.site,
    salary: job.salary,
    position: job.position,
    location: job.location,
    stage: job.stage,
    memo: job.memo,
    appliedAt: job.appliedAt,
  }
}

export function JobFormModal({ open, initial, onClose, onSubmit }: JobFormModalProps) {
  if (!open) return null

  return (
    <JobFormModalContent
      key={initial?.id ?? 'new'}
      initial={initial}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

function JobFormModalContent({
  initial,
  onClose,
  onSubmit,
}: Omit<JobFormModalProps, 'open'>) {
  const [form, setForm] = useState<JobFormData>(() => toFormData(initial))

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.company.trim()) return
    onSubmit(form)
    onClose()
  }

  const set = (field: keyof JobFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Field label="Company" required>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="e.g. Google"
                className={inputClass}
                autoFocus
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Position">
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => set('position', e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className={inputClass}
                />
              </Field>
              <Field label="Salary">
                <input
                  type="text"
                  value={form.salary}
                  onChange={(e) => set('salary', e.target.value)}
                  placeholder="e.g. $120,000"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Location">
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className={inputClass}
                />
              </Field>
              <Field label="Application Site">
                <input
                  type="text"
                  value={form.site}
                  onChange={(e) => set('site', e.target.value)}
                  placeholder="e.g. linkedin.com"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Applied Date">
                <input
                  type="date"
                  value={toDateInputValue(form.appliedAt)}
                  onChange={(e) => set('appliedAt', fromDateInputValue(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Stage">
                <select
                  value={form.stage}
                  onChange={(e) => set('stage', e.target.value)}
                  className={inputClass}
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                value={form.memo}
                onChange={(e) => set('memo', e.target.value)}
                placeholder="Interview dates, recruiter contact, etc."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {initial ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100'
