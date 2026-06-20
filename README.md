# TradeDesk

A lightweight CRM dashboard built with Vue 3.

## Tech Stack

- Vue 3 + Vite
- Pinia
- Vue Router
- Tailwind CSS
- Axios
- json-server (mock backend)
- vue-draggable-plus
- lucide-vue-next

## Setup

```bash
npm install
npm run dev:all
```

This starts both the Vite dev server and the mock API concurrently.

- App: http://localhost:5173
- API: http://localhost:3001

## Mock API

Data is served by json-server from `db.json`.

```bash
npm run server
```

Endpoints:

| Method | URL | Description |
|---|---|---|
| GET | /deals | List all deals |
| POST | /deals | Create a deal |
| PATCH | /deals/:id | Update deal stage |
| GET | /ibs | List IBs (supports limit, offset, ordering, field__contains) |
| GET | /metrics | Dashboard metrics |

All requests are real HTTP calls visible in the browser Network tab.

## Folder Structure

```
src/
  api/          # Axios instance + API modules
  components/
    layout/     # AppSidebar, AppTopBar
    ui/         # BaseTable, BasePagination, BaseModal, SkeletonLoader
  stores/       # Pinia stores (theme, deals, ibs)
  views/        # WorkspaceView, WorkspaceSummary, DealsView, IBsView
  router/       # Vue Router config
```