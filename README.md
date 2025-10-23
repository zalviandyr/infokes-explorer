# Infokes Explorer

## Technologies

- Bun 1.3.1 untuk runtime dan package manager
- Turbo Repo untuk orkestrasi workspace
- Frontend: Vue 3, Vite, Tailwind CSS, Vitest, Testing Library
- Backend: Elysia (Bun), Drizzle ORM, Postgres

## How to run local

1. Instal dependensi di seluruh workspace:
   ```bash
   bun install
   ```
2. Salin variabel lingkungan backend dan sesuaikan bila perlu:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
3. Jalankan backend (watch mode):
   ```bash
   cd apps/backend
   bun run dev
   ```
4. Jalankan frontend (Vite dev server):
   ```bash
   cd apps/frontend
   bun run dev
   ```
   Buka `http://localhost:5173` (atau port yang ditampilkan) di browser.

> Alternatif: dari root, jalankan `bun run dev` untuk menjalankan pipeline Turbo yang mem-boot script `dev` tiap workspace secara paralel.

## How to test

- Backend:
  ```bash
  cd apps/backend
  bun test
  ```
- Frontend:
  ```bash
  cd apps/frontend
  bun run test --run
  ```
  Gunakan `bun run test` tanpa `--run` bila ingin mode watch dari Vitest.
