import { useCallback, useEffect, useState } from 'react'
import {
  formDataToRow,
  formDataToUpdate,
  rowToApplication,
  type ApplicationRow,
} from '../lib/applicationMapper.ts'
import { supabase } from '../lib/supabase.ts'
import type { JobApplication, JobFormData } from '../types/job.ts'

const LEGACY_STORAGE_KEY = 'jobtracker-applications'

async function migrateLegacyData(userId: string) {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!raw) return

  try {
    const apps = JSON.parse(raw) as JobApplication[]
    if (!apps.length) {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return
    }

    const rows = apps.map((app) => ({
      user_id: userId,
      company: app.company,
      site: app.site,
      salary: app.salary,
      position: app.position,
      location: app.location,
      stage: app.stage,
      memo: app.memo,
      applied_at: app.appliedAt,
      updated_at: app.updatedAt,
    }))

    const { error } = await supabase.from('applications').insert(rows)
    if (!error) localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // ignore invalid legacy data
  }
}

async function fetchApplicationsForUser(userId: string) {
  await migrateLegacyData(userId)

  return supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('applied_at', { ascending: false })
}

export function useJobApplications(userId: string) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchApplicationsForUser(userId).then(({ data, error: fetchError }) => {
      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setApplications([])
      } else {
        setApplications((data as ApplicationRow[]).map(rowToApplication))
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [userId])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await fetchApplicationsForUser(userId)

    if (fetchError) {
      setError(fetchError.message)
      setApplications([])
    } else {
      setApplications((data as ApplicationRow[]).map(rowToApplication))
    }
    setLoading(false)
  }, [userId])

  const addApplication = useCallback(
    async (data: JobFormData) => {
      setError(null)
      const { data: row, error: insertError } = await supabase
        .from('applications')
        .insert(formDataToRow(data, userId))
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      setApplications((prev) => [rowToApplication(row as ApplicationRow), ...prev])
    },
    [userId],
  )

  const updateApplication = useCallback(async (id: string, data: JobFormData) => {
    setError(null)
    const { data: row, error: updateError } = await supabase
      .from('applications')
      .update(formDataToUpdate(data))
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return
    }

    const updated = rowToApplication(row as ApplicationRow)
    setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)))
  }, [])

  const deleteApplication = useCallback(async (id: string) => {
    setError(null)
    const { error: deleteError } = await supabase.from('applications').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setApplications((prev) => prev.filter((app) => app.id !== id))
  }, [])

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refetch,
  }
}
