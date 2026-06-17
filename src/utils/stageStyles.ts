import type { Stage } from '../types/job.ts'

export const STAGE_STYLES: Record<Stage, string> = {
  'Not Applied': 'bg-gray-100 text-gray-500 ring-gray-200',
  Applied: 'bg-slate-100 text-slate-700 ring-slate-200',
  'Resume Passed': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Assignment/Test': 'bg-violet-50 text-violet-700 ring-violet-200',
  '1st Interview': 'bg-amber-50 text-amber-700 ring-amber-200',
  '2nd Interview': 'bg-orange-50 text-orange-700 ring-orange-200',
  'Final Interview': 'bg-rose-50 text-rose-700 ring-rose-200',
  Accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Rejected: 'bg-red-50 text-red-600 ring-red-200',
  'On Hold': 'bg-gray-100 text-gray-500 ring-gray-200',
}

export function getStageStyle(stage: Stage) {
  return STAGE_STYLES[stage]
}
