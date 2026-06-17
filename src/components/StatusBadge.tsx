import type { Stage } from '../types/job.ts'
import { STAGE_STYLES } from '../utils/stageStyles.ts'

interface StatusBadgeProps {
  stage: Stage
}

export function StatusBadge({ stage }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_STYLES[stage]}`}
    >
      {stage}
    </span>
  )
}
