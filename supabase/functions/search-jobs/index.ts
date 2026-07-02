import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

type JobSearchFilters = {
  keyword?: string
  location?: string
  salary?: string
  workType?: string
}

type SeekJob = {
  id: string
  title?: string
  companyName?: string
  salaryLabel?: string
  teaser?: string
  listingDate?: string
  workTypes?: string[]
  locations?: Array<{ label?: string }>
  workArrangements?: { displayText?: string }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const filters = (await req.json()) as JobSearchFilters
    const results = await searchSeekJobs(filters)
    const cached = await cacheJobPosts(results)

    return Response.json(
      {
        results: cached,
        totalCount: cached.length,
        fetchedAt: new Date().toISOString(),
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown search error'
    return Response.json({ error: message }, { status: 500, headers: corsHeaders })
  }
})

async function searchSeekJobs(filters: JobSearchFilters) {
  const url = new URL('https://www.seek.com.au/api/jobsearch/v5/search')
  url.searchParams.set('page', '1')

  if (filters.keyword?.trim()) {
    url.searchParams.set('keywords', filters.keyword.trim())
  }

  if (filters.location?.trim()) {
    url.searchParams.set('where', filters.location.trim())
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Seek search failed with status ${response.status}`)
  }

  const payload = await response.json()
  const jobs = Array.isArray(payload?.data) ? (payload.data as SeekJob[]) : []

  return jobs
    .map((job) => normalizeSeekJob(job))
    .filter((job) => matchesWorkType(job.workType, filters.workType))
    .filter((job) => matchesSalary(job.salary, filters.salary))
}

function normalizeSeekJob(job: SeekJob) {
  return {
    id: null,
    source: 'seek',
    externalId: job.id,
    title: job.title ?? 'Untitled role',
    company: job.companyName ?? '',
    location: job.locations?.[0]?.label ?? '',
    salary: job.salaryLabel ?? '',
    workType: job.workTypes?.join(', ') ?? '',
    workArrangement: job.workArrangements?.displayText ?? '',
    summary: job.teaser ?? '',
    url: `https://www.seek.com.au/job/${job.id}`,
    postedAt: job.listingDate ?? null,
    rawPayload: job,
  }
}

function matchesWorkType(value: string, filter?: string) {
  if (!filter?.trim()) return true
  return value.toLowerCase().includes(filter.trim().toLowerCase())
}

function matchesSalary(value: string, filter?: string) {
  if (!filter?.trim()) return true

  const normalizedFilter = filter.trim().toLowerCase()
  const normalizedSalary = value.toLowerCase()

  if (normalizedSalary.includes(normalizedFilter)) {
    return true
  }

  const target = Number.parseInt(normalizedFilter.replace(/[^0-9]/g, ''), 10)
  if (Number.isNaN(target)) return false

  const salaryNumbers = Array.from(value.matchAll(/\d[\d,]*/g))
    .map((match) => Number.parseInt(match[0].replace(/,/g, ''), 10))
    .filter((number) => !Number.isNaN(number))

  return salaryNumbers.some((number) => number >= target)
}

async function cacheJobPosts(
  jobs: Array<
    ReturnType<typeof normalizeSeekJob>
  >,
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey || jobs.length === 0) {
    return jobs
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const rows = jobs.map((job) => ({
    source: job.source,
    external_id: job.externalId,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    work_type: job.workType,
    work_arrangement: job.workArrangement,
    url: job.url,
    summary: job.summary,
    posted_at: job.postedAt,
    fetched_at: new Date().toISOString(),
    raw_payload: job.rawPayload,
  }))

  const { data, error } = await supabase
    .from('job_posts')
    .upsert(rows, { onConflict: 'source,external_id' })
    .select('id, source, external_id, title, company, location, salary, work_type, work_arrangement, url, summary, posted_at')

  if (error || !data) {
    return jobs
  }

  return data.map((row) => ({
    id: row.id,
    source: row.source,
    externalId: row.external_id,
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary,
    workType: row.work_type,
    workArrangement: row.work_arrangement,
    summary: row.summary,
    url: row.url,
    postedAt: row.posted_at,
  }))
}
