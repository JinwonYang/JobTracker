export function SetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200/60">
        <h1 className="text-xl font-bold text-slate-900">Supabase setup required</h1>
        <p className="mt-2 text-sm text-slate-600">
          Copy <code className="rounded bg-slate-100 px-1.5 py-0.5">.env.example</code> to{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> and add your Supabase
          project URL and anon key.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Create a project at supabase.com</li>
          <li>Run <code className="rounded bg-slate-100 px-1">supabase/schema.sql</code> in SQL Editor</li>
          <li>Copy API keys from Project Settings → API</li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  )
}
