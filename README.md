# Grand Atlas

Responsive real-estate website built with React, Vite, React Router, Axios,
TanStack Query, React Hook Form, Zod, and React Helmet Async.

## Setup

1. Install Node.js 20.19+ and npm.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_BASE_URL` to `/api/v1`. Vercel proxies this path to the
   production API.
4. Set `VITE_SITE_URL` to the deployed website origin, such as
   `https://grand-atlas.vercel.app`.
5. Run `npm install` and `npm run dev`.

The app stops with a clear error if `VITE_API_BASE_URL` is missing; production
builds also require it to be a same-origin path. Configure both
`VITE_API_BASE_URL` and `VITE_SITE_URL` in the hosting dashboard before the
production build. The Vercel API rewrite proxies API requests to avoid
cross-origin browser requests. The live zone API does not include coordinates;
`/map` uses approximate zone-center coordinates from
`src/features/map/data/locations.ts`. Set `VITE_SITE_URL` to the public website
origin before building so the generated sitemap and robots file use the correct
host.

## Scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — generate `robots.txt` and `sitemap.xml`, then build the app.
- `npm run preview` — preview the production build.
- `npm test` — run the unit tests.
- `npm run test:watch` — run tests in watch mode.
- `npm run lint` — lint source files.
- `npm run format` — format source, documentation, and root config files.
- `npm run format:check` — check formatting.

## Structure

```text
src/
  app/                 App, router, providers, auth and error handling
  api/                 Shared Axios client
  components/
    layout/            Shared Header, Footer and Layout
    ui/                Shared loading, error and empty states
  config/              Environment configuration
  features/
    admin/
    auth/
    contact/
    developers/
    home/
    images/
    map/
    projects/
    units/
    zones/
  styles/              Design tokens and global styles
```

Feature API requests live in their `api` modules and are consumed through
TanStack Query hooks. The base URL is provided by `VITE_API_BASE_URL`.
