import { http, HttpResponse } from 'msw'
import db from '../../db.json'

const DEALS_KEY = 'tradedesk-deals'

// Load from localStorage
const loadDeals = () => {
  try {
    const stored = localStorage.getItem(DEALS_KEY)
    return stored ? JSON.parse(stored) : [...db.deals]
  } catch {
    return [...db.deals]
  }
}
const saveDeals = (deals) => localStorage.setItem(DEALS_KEY, JSON.stringify(deals))

let deals = loadDeals()
const ibs = [...db.ibs]

export const handlers = [

  // ── Deals ────────────────────────────────────────────────────────
  http.get('/deals', () => {
    return HttpResponse.json(deals)
  }),

  http.post('/deals', async ({ request }) => {
    const body = await request.json()
    const deal = { ...body, id: Date.now() }
    deals.push(deal)
    saveDeals(deals)
    return HttpResponse.json(deal, { status: 201 })
  }),

  http.patch('/deals/:id', async ({ request, params }) => {
    const body = await request.json()
    const id = parseInt(params.id)
    const index = deals.findIndex((d) => d.id === id)
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    deals[index] = { ...deals[index], ...body }
    saveDeals(deals)
    return HttpResponse.json(deals[index])
  }),

  // ── IBs ──────────────────────────────────────────────────────────
  http.get('/ibs', ({ request }) => {
    const url = new URL(request.url)
    const q = Object.fromEntries(url.searchParams)

    let results = [...ibs]

    // Column filters
    for (const field of ['username', 'email', 'firstName', 'lastName', 'state']) {
      const val = q[`${field}__contains`]
      if (val) results = results.filter((ib) =>
        ib[field].toLowerCase().includes(val.toLowerCase())
      )
    }

    // Sorting
    if (q.ordering) {
      const desc = q.ordering.startsWith('-')
      const field = desc ? q.ordering.slice(1) : q.ordering
      results.sort((a, b) =>
        (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) * (desc ? -1 : 1)
      )
    }

    const total = results.length

    // Pagination
    const limit = q.limit ? parseInt(q.limit) : results.length
    const offset = q.offset ? parseInt(q.offset) : 0
    results = results.slice(offset, offset + limit)

    return HttpResponse.json(results, {
      headers: { 'X-Total-Count': String(total) },
    })
  }),

  // ── Metrics ──────────────────────────────────────────────────────
  http.get('/metrics', () => {
    return HttpResponse.json(db.metrics)
  }),
]
