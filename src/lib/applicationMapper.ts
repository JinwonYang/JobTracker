import type { JobApplication, JobFormData, Stage } from '../types/job.ts'

export interface ApplicationRow {
  id: string
  user_id: string
  company: string
  site: string
  salary: string
  position: string
  location: string
  stage: string
  memo: string
  applied_at: string
  updated_at: string
}

export function rowToApplication(row: ApplicationRow): JobApplication {
  return {
    id: row.id,
    company: row.company,
    site: row.site,
    salary: row.salary,
    position: row.position,
    location: row.location,
    stage: row.stage as Stage,
    memo: row.memo,
    appliedAt: row.applied_at,
    updatedAt: row.updated_at,
  }
}

export function formDataToRow(data: JobFormData, userId: string) {
  return {
    user_id: userId,
    company: data.company,
    site: data.site,
    salary: data.salary,
    position: data.position,
    location: data.location,
    stage: data.stage,
    memo: data.memo,
    applied_at: data.appliedAt,
    updated_at: new Date().toISOString(),
  }
}

export function formDataToUpdate(data: JobFormData) {
  return {
    company: data.company,
    site: data.site,
    salary: data.salary,
    position: data.position,
    location: data.location,
    stage: data.stage,
    memo: data.memo,
    applied_at: data.appliedAt,
    updated_at: new Date().toISOString(),
  }
}
