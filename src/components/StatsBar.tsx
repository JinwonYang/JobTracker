import type { JobApplication } from '../types/job'
import { TERMINAL_STAGES } from '../types/job'

interface StatsBarProps {
  applications: JobApplication[]
}

export function StatsBar({ applications }: StatsBarProps) {
  const total = applications.length
  const active = applications.filter((a) => !TERMINAL_STAGES.includes(a.stage)).length
  const passed = applications.filter((a) => a.stage === 'Accepted').length
  const rejected = applications.filter((a) => a.stage === 'Rejected').length

  const stats = [
    { label: 'Total', value: total, color: 'text-slate-900' },
    { label: 'In Progress', value: active, color: 'text-blue-600' },
    { label: 'Accepted', value: passed, color: 'text-emerald-600' },
    { label: 'Rejected', value: rejected, color: 'text-red-500' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{stat.label}</p>
          <p className={`mt-0.5 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
