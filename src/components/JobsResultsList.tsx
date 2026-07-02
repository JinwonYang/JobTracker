import type { JobPost } from "../types/jobPost.ts";

interface JobsResultsListProps {
  jobs: JobPost[];
  loading: boolean;
  hasSearched: boolean;
  totalCount: number;
  onApply: (job: JobPost) => void;
}

export function JobsResultsList({
  jobs,
  loading,
  hasSearched,
  totalCount,
  onApply,
}: JobsResultsListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        Loading jobs...
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        Search for roles from the new Jobs tab, then add promising postings to
        your tracker.
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
        No jobs matched that search. Try broadening the keyword, location, or
        salary filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Showing {jobs.length} of {totalCount} results
      </p>

      <div className="space-y-3">
        {jobs.map((job) => (
          <article
            key={`${job.source}-${job.externalId}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <SourceBadge source={job.source} />
                  {job.workType && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {job.workType}
                    </span>
                  )}
                  {job.workArrangement && (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                      {job.workArrangement}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {job.company || "Unknown company"}
                  {job.location ? ` · ${job.location}` : ""}
                </p>

                {(job.salary || job.postedAt) && (
                  <p className="mt-2 text-sm text-slate-500">
                    {job.salary || "Salary not listed · "}
                    {job.salary && job.postedAt ? " · " : ""}
                    {job.postedAt ? formatPostedAt(job.postedAt) : ""}
                  </p>
                )}

                {job.summary && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {job.summary}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Open source
                </a>
                <button
                  onClick={() => onApply(job)}
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Apply to tracker
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
      {source}
    </span>
  );
}

function formatPostedAt(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
