import { useState, type FormEvent } from 'react'
import { EMPTY_JOB_SEARCH_FILTERS, type JobSearchFilters } from '../types/jobPost.ts'

interface JobsSearchPanelProps {
  loading: boolean
  onSearch: (filters: JobSearchFilters) => void
}

const workTypeOptions = ['', 'Full time', 'Part time', 'Contract/Temp', 'Casual/Vacation']

export function JobsSearchPanel({ loading, onSearch }: JobsSearchPanelProps) {
  const [filters, setFilters] = useState<JobSearchFilters>(EMPTY_JOB_SEARCH_FILTERS)

  const update = (field: keyof JobSearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters(EMPTY_JOB_SEARCH_FILTERS)
    onSearch(EMPTY_JOB_SEARCH_FILTERS)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Keyword">
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => update('keyword', e.target.value)}
            placeholder="e.g. software engineer"
            className={inputClass}
          />
        </Field>
        <Field label="Location">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Melbourne VIC"
            className={inputClass}
          />
        </Field>
        <Field label="Salary">
          <input
            type="text"
            value={filters.salary}
            onChange={(e) => update('salary', e.target.value)}
            placeholder="e.g. 100000 or 80k"
            className={inputClass}
          />
        </Field>
        <Field label="Work type">
          <select
            value={filters.workType}
            onChange={(e) => update('workType', e.target.value)}
            className={inputClass}
          >
            {workTypeOptions.map((option) => (
              <option key={option || 'all'} value={option}>
                {option || 'All work types'}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading ? 'Searching...' : 'Search jobs'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Reset
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100'
