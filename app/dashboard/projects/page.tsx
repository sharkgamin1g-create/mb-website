'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ImagePlus, LogOut, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import type { Project, ProjectCategory } from '@/lib/site-data'
import { CATEGORY_LABELS } from '@/lib/site-data'

const categories: ProjectCategory[] = ['residential', 'corporate', 'commercial', 'hospitality', 'industrial']

const emptyProject: Project = {
  slug: '',
  name: '',
  category: 'commercial',
  location: '',
  year: '',
  area: '',
  scope: '',
  summary: '',
  description: '',
  image: '',
}

export default function ProjectsDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<Project>(emptyProject)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedSession = window.sessionStorage.getItem('master-build-dashboard-auth')
    if (storedSession === 'true') {
      setAuthenticated(true)
      void loadProjects()
    }
  }, [])

  async function loadProjects() {
    setIsLoading(true)
    const response = await fetch('/api/dashboard/projects', { cache: 'no-store' })
    if (response.ok) {
      const payload = (await response.json()) as { projects: Project[] }
      setProjects(payload.projects)
      setError('')
    } else {
      setAuthenticated(false)
      window.sessionStorage.removeItem('master-build-dashboard-auth')
    }
    setIsLoading(false)
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const response = await fetch('/api/dashboard/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    })
    if (!response.ok) {
      setError('Invalid username or password.')
      return
    }
    setAuthenticated(true)
    window.sessionStorage.setItem('master-build-dashboard-auth', 'true')
    await loadProjects()
  }

  function startNewProject() {
    setEditingSlug(null)
    setForm(emptyProject)
    setError('')
  }

  function editProject(project: Project) {
    setEditingSlug(project.slug)
    setForm(project)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadImage(file: File) {
    setError('')
    setIsUploading(true)
    const data = new FormData()
    data.set('file', file)
    const response = await fetch('/api/dashboard/upload', { method: 'POST', body: data })
    const payload = (await response.json()) as { url?: string; error?: string }
    setIsUploading(false)
    if (!response.ok || !payload.url) {
      setError(payload.error ?? 'Image upload failed.')
      return
    }
    setForm((current) => ({ ...current, image: payload.url ?? '' }))
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    const endpoint = editingSlug ? `/api/dashboard/projects/${editingSlug}` : '/api/dashboard/projects'
    const response = await fetch(endpoint, {
      method: editingSlug ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const payload = (await response.json()) as { project?: Project; error?: string }
    setIsSaving(false)
    if (!response.ok || !payload.project) {
      setError(payload.error ?? 'Could not save this project.')
      return
    }
    setProjects((current) => {
      const next = current.filter((project) => project.slug !== (editingSlug ?? payload.project?.slug))
      return [payload.project as Project, ...next]
    })
    startNewProject()
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete ${project.name}?`)) return
    const response = await fetch(`/api/dashboard/projects/${project.slug}`, { method: 'DELETE' })
    if (!response.ok) {
      setError('Could not delete this project.')
      return
    }
    setProjects((current) => current.filter((item) => item.slug !== project.slug))
    if (editingSlug === project.slug) startNewProject()
  }

  async function logout() {
    await fetch('/api/dashboard/auth', { method: 'DELETE' })
    window.sessionStorage.removeItem('master-build-dashboard-auth')
    setAuthenticated(false)
    setProjects([])
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-navy px-6 py-16 text-white md:px-10">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <form onSubmit={handleLogin} className="w-full rounded-lg border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">Master Build</p>
            <h1 className="mt-5 text-3xl font-medium tracking-tight">Projects dashboard</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">Private workspace for publishing selected work to the website.</p>
            <div className="mt-8 space-y-4">
              <label className="block text-sm font-medium">
                Username
                <input required value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-white/60" autoComplete="username" />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input required type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} className="mt-2 w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-white/60" autoComplete="current-password" />
              </label>
            </div>
            {error && <p role="alert" className="mt-4 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm text-red-100">{error}</p>}
            <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-white/90">Sign in</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-secondary px-5 py-8 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-eyebrow">Private workspace</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Projects dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Only projects saved here appear on the public website.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={startNewProject} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus className="size-4" />New project</button>
            <button type="button" onClick={logout} aria-label="Sign out" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"><LogOut className="size-4" /></button>
          </div>
        </header>

        <div className="grid gap-8 py-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="order-2 xl:order-1">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-medium">Published projects</h2><span className="text-sm text-muted-foreground">{isLoading ? 'Loading...' : `${projects.length} projects`}</span></div>
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
              {projects.map((project) => (
                <article key={project.slug} className="flex gap-4 p-4 sm:p-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary sm:size-24">
                    {project.image ? <img src={project.image} alt="" className="size-full object-cover" /> : <ImagePlus className="m-auto mt-7 size-5 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-medium">{project.name}</h3><p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{CATEGORY_LABELS[project.category]} · {project.year}</p></div><div className="flex gap-1"><button type="button" onClick={() => editProject(project)} aria-label={`Edit ${project.name}`} className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"><Pencil className="size-3.5" /></button><button type="button" onClick={() => deleteProject(project)} aria-label={`Delete ${project.name}`} className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button></div></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.summary}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="order-1 xl:order-2">
            <form onSubmit={saveProject} className="rounded-lg border border-border bg-background p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><p className="label-eyebrow">{editingSlug ? 'Edit project' : 'New project'}</p><h2 className="mt-2 text-2xl font-medium tracking-tight">Project details</h2></div>{editingSlug && <button type="button" onClick={startNewProject} aria-label="Cancel editing" className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"><X className="size-4" /></button>}</div>
              <div className="mt-6 space-y-4">
                <Field label="Name *" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
                <Field label="Slug *" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} required placeholder="project-slug" />
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} /><Field label="Year" value={form.year} onChange={(value) => setForm({ ...form, year: value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProjectCategory })} className="input-mb mt-2">{categories.map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}</select></label><Field label="Area" value={form.area} onChange={(value) => setForm({ ...form, area: value })} placeholder="2,400 m²" /></div>
                <Field label="Scope" value={form.scope} onChange={(value) => setForm({ ...form, scope: value })} placeholder="Fit-Out · MEP" />
                <Field label="Overview / summary" value={form.summary} onChange={(value) => setForm({ ...form, summary: value })} textarea required />
                <Field label="Full description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} textarea rows={5} />
                <label className="block text-sm font-medium">Project image<div className="mt-2 flex gap-2"><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="input-mb" placeholder="/uploads/project.jpg" required /><label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-border px-3 text-muted-foreground hover:bg-accent" aria-label="Upload project image"><Upload className="size-4" /><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={isUploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file) }} /></label></div>{isUploading && <span className="mt-2 block text-xs text-muted-foreground">Uploading image...</span>}</label>
              </div>
              {error && <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={isSaving || isUploading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"><Save className="size-4" />{isSaving ? 'Saving...' : editingSlug ? 'Save changes' : 'Publish project'}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, placeholder, required, textarea, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; textarea?: boolean; rows?: number }) {
  return <label className="block text-sm font-medium">{label}{textarea ? <textarea required={required} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="input-mb mt-2 resize-y" placeholder={placeholder} /> : <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="input-mb mt-2" placeholder={placeholder} />}</label>
}
