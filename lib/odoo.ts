import {
  OPEN_ROLES,
  PROJECTS,
  SERVICES,
  type OpenRole,
  type Project,
  type Service,
} from '@/lib/site-data'
import { getLocalProjects } from '@/lib/projects-store'

export type OdooConfig = {
  url: string
  db: string
  username: string
  password: string
}

export type OdooLeadInput = {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
  source?: string
}

export type OdooQuoteInput = {
  name?: string
  email?: string
  phone?: string
  notes?: string
  projectType?: string
  services?: string[]
  area?: number
  finish?: string
  estimate?: {
    low?: number
    high?: number
    perSqm?: number
  }
}

const FALLBACK_CONFIG = {
  url: process.env.ODOO_URL ?? '',
  db: process.env.ODOO_DB ?? '',
  username: process.env.ODOO_USERNAME ?? '',
  password: process.env.ODOO_PASSWORD ?? '',
}

export const getOdooConfig = (): OdooConfig | null => {
  const { url, db, username, password } = FALLBACK_CONFIG

  if (!url || !db || !username || !password) {
    return null
  }

  return { url, db, username, password }
}

export const isOdooEnabled = Boolean(getOdooConfig())

async function odooJsonRpc<T = unknown>(payload: Record<string, unknown>): Promise<T> {
  const config = getOdooConfig()

  if (!config) {
    throw new Error('Odoo configuration is missing. Set ODOO_URL, ODOO_DB, ODOO_USERNAME and ODOO_PASSWORD.')
  }

  const response = await fetch(`${config.url.replace(/\/+$/, '')}/jsonrpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Odoo request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function odooLogin(config: OdooConfig): Promise<number | null> {
  const response = await odooJsonRpc<{ result?: number; error?: { message?: string } }>({
    jsonrpc: '2.0',
    method: 'call',
    id: Date.now(),
    params: {
      service: 'common',
      method: 'login',
      args: [config.db, config.username, config.password],
    },
  })

  if (response.error) {
    throw new Error(response.error.message ?? 'Odoo login failed')
  }

  return response.result ?? null
}

export async function odooExecute<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {},
): Promise<T | null> {
  const config = getOdooConfig()

  if (!config) {
    return null
  }

  const uid = await odooLogin(config)

  if (!uid) {
    return null
  }

  const response = await odooJsonRpc<{ result?: T; error?: { message?: string } }>({
    jsonrpc: '2.0',
    method: 'call',
    id: Date.now(),
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [config.db, uid, config.password, model, method, args, kwargs],
    },
  })

  if (response.error) {
    throw new Error(response.error.message ?? `Odoo execute failed for ${model}.${method}`)
  }

  return response.result ?? null
}

export async function createLead(values: OdooLeadInput) {
  if (!isOdooEnabled) {
    return { success: true, source: 'fallback', id: 'local-fallback' }
  }

  const email = values.email?.trim().toLowerCase() ?? ''
  const phone = values.phone?.trim() ?? ''
  const duplicateDomain: unknown[] = []

  if (email) duplicateDomain.push(['email_from', '=', email])
  if (phone) duplicateDomain.push(['phone', '=', phone])

  const description = [
    `Source: ${values.source ?? 'website'}`,
    values.service ? `Requested service: ${values.service}` : '',
    values.message ?? '',
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    if (duplicateDomain.length > 0) {
      const existingLeads = await odooExecute<{ id: number }[]>('crm.lead', 'search_read', [duplicateDomain], {
        fields: ['id'],
        limit: 1,
      })

      if (existingLeads?.[0]?.id) {
        return { success: true, source: 'odoo-existing', id: existingLeads[0].id, duplicate: true }
      }
    }

    const lead = await odooExecute<number>('crm.lead', 'create', [
      {
        name: values.name ?? 'Website Lead',
        email_from: email,
        phone,
        description,
        source_id: false,
        type: 'lead',
      },
    ])

    return { success: true, source: 'odoo', id: lead }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (!message.includes('crm.lead') && !message.includes('doesn\'t exist')) {
      throw error
    }

    const partner = await odooExecute<number>('res.partner', 'create', [
      {
        name: values.name ?? 'Website Contact',
        email: values.email ?? '',
        phone: values.phone ?? '',
        comment: description,
      },
    ])

    return { success: true, source: 'odoo-contact-fallback', id: partner }
  }
}

export async function createQuoteRequest(values: OdooQuoteInput) {
  if (!isOdooEnabled) {
    return { success: true, source: 'fallback', id: 'quote-fallback' }
  }

  const quote = await odooExecute<number>('sale.order', 'create', [
    {
      partner_id: false,
      name: values.name ?? 'Website Quote Request',
      note: [
        `Customer: ${values.name ?? 'Not provided'}`,
        `Email: ${values.email ?? 'Not provided'}`,
        `Phone: ${values.phone ?? 'Not provided'}`,
        `Project type: ${values.projectType ?? 'Not provided'}`,
        `Services: ${(values.services ?? []).join(', ') || 'Not provided'}`,
        `Area: ${values.area ?? 'Not provided'}`,
        `Finish: ${values.finish ?? 'Not provided'}`,
        values.notes ?? '',
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ])

  return { success: true, source: 'odoo', id: quote }
}

export async function getCompanyProfile() {
  if (!isOdooEnabled) {
    return {
      name: 'Master Build',
      email: 'hello@masterbuild.example',
      phone: '+20 100 000 0000',
      city: 'Cairo, Egypt',
      source: 'fallback',
    }
  }

  const company = await odooExecute<Record<string, unknown>[]>('res.company', 'search_read', [[['id', '>', 0]]], {
    fields: ['name', 'email', 'phone', 'city'],
    limit: 1,
  })

  return {
    ...(company?.[0] ?? {}),
    source: 'odoo',
  }
}

export async function getServices(): Promise<Service[]> {
  if (!isOdooEnabled) {
    return SERVICES
  }

  try {
    const rows = await odooExecute<Record<string, unknown>[]>('website.service', 'search_read', [[['id', '>', 0]]], {
      fields: ['id', 'name', 'description', 'sequence'],
    })

    if (!rows || rows.length === 0) {
      return SERVICES
    }

    return rows.map((row, index) => ({
      id: String(row.id ?? `service-${index + 1}`),
      index: String((index + 1)).padStart(2, '0'),
      title: String(row.name ?? 'Service'),
      description: String(row.description ?? 'Service description'),
      image: SERVICES[index % SERVICES.length]?.image ?? '/images/hero-architecture.png',
    }))
  } catch {
    return SERVICES
  }
}

export async function getProjects(): Promise<Project[]> {
  return getLocalProjects()
}

export async function getOpenRoles(): Promise<OpenRole[]> {
  if (!isOdooEnabled) {
    return OPEN_ROLES
  }

  try {
    const rows = await odooExecute<Record<string, unknown>[]>('hr.job', 'search_read', [[['id', '>', 0]]], {
      fields: ['id', 'name', 'department_id', 'address_id'],
    })

    if (!rows || rows.length === 0) {
      return OPEN_ROLES
    }

    return rows.map((row, index) => ({
      title: String(row.name ?? 'Open Role'),
      department: String(row.department_id ?? 'General'),
      location: String(Array.isArray(row.address_id) ? row.address_id[1] : row.address_id ?? 'Cairo, Egypt'),
      type: 'Full-time',
    }))
  } catch {
    return OPEN_ROLES
  }
}

export async function getAboutContent() {
  const values = [
    { title: 'Precision', body: 'Every millimeter, every deadline, every budget line — measured and honored.' },
    { title: 'Experience', body: 'Years of delivering complex projects across sectors and scales.' },
    { title: 'Trust', body: 'One accountable partner from first sketch to final handover.' },
    { title: 'Craftsmanship', body: 'A relentless standard of finish that speaks for itself.' },
  ]

  if (!isOdooEnabled) {
    return {
      eyebrow: 'About Master Build',
      title: 'We build what you imagine.',
      description:
        'An integrated construction and fit-out company turning ambitious visions into spaces that perform, endure and inspire.',
      storyTitle: 'One team, accountable for the whole build.',
      storyParagraphs: [
        'Master Build brings construction, fit-out, interior design, project management and electro-mechanical works under a single roof — so vision, engineering and craftsmanship move together instead of being handed between disconnected vendors.',
        'From residential villas to corporate headquarters, retail environments and hospitality destinations, we deliver turnkey spaces with a level of finish and control our clients return to us for.',
      ],
      values,
      source: 'fallback',
    }
  }

  try {
    const company = await getCompanyProfile()

    return {
      eyebrow: 'About Master Build',
      title: 'We build what you imagine.',
      description: `An integrated construction and fit-out company turning ambitious visions into spaces that perform, endure and inspire.`,
      storyTitle: 'One team, accountable for the whole build.',
      storyParagraphs: [
        `${company.name ?? 'Master Build'} brings construction, fit-out, interior design, project management and electro-mechanical works under a single roof — so vision, engineering and craftsmanship move together instead of being handed between disconnected vendors.`,
        'From residential villas to corporate headquarters, retail environments and hospitality destinations, we deliver turnkey spaces with a level of finish and control our clients return to us for.',
      ],
      values,
      source: 'odoo',
    }
  } catch {
    return {
      eyebrow: 'About Master Build',
      title: 'We build what you imagine.',
      description:
        'An integrated construction and fit-out company turning ambitious visions into spaces that perform, endure and inspire.',
      storyTitle: 'One team, accountable for the whole build.',
      storyParagraphs: [
        'Master Build brings construction, fit-out, interior design, project management and electro-mechanical works under a single roof — so vision, engineering and craftsmanship move together instead of being handed between disconnected vendors.',
        'From residential villas to corporate headquarters, retail environments and hospitality destinations, we deliver turnkey spaces with a level of finish and control our clients return to us for.',
      ],
      values,
      source: 'fallback',
    }
  }
}
