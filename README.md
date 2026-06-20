# TradeDesk

A lightweight CRM dashboard built with Vue 3.

## Tech Stack

- Vue 3 + Vite
- Pinia
- Vue Router
- Tailwind CSS
- Axios
- MSW (Mock Service Worker)
- vue-draggable-plus
- lucide-vue-next

## Setup

```bash
npm install
npm run dev
```

App runs at http://localhost:5173. No separate server needed — MSW intercepts all API calls in the browser.

## Mock API

API requests are handled by Mock Service Worker (MSW). All interactions trigger real HTTP requests visible in the browser Network tab.

Endpoints:

| Method | URL | Description |
|---|---|---|
| GET | /deals | List all deals |
| POST | /deals | Create a deal |
| PATCH | /deals/:id | Update deal stage |
| GET | /ibs | List IBs (supports limit, offset, ordering, field__contains) |
| GET | /metrics | Dashboard metrics |

Mock data is defined in `db.json`. Created deals persist across page refreshes via localStorage.

## Live Demo

https://trading-dashboard-five-wine.vercel.app

## Folder Structure

```
src/
  api/          # Axios instance + API modules
  mocks/        # MSW handlers and browser setup
  components/
    layout/     # AppSidebar, AppTopBar
    ui/         # BaseTable, BasePagination, BaseModal, SkeletonLoader
  stores/       # Pinia stores (theme, deals, ibs)
  views/        # WorkspaceView, WorkspaceSummary, DealsView, IBsView
  router/       # Vue Router config
```
