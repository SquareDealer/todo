/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

type VercelConfig = {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}

// Serve the same security headers in `vite preview` as Vercel does in production,
// so CSP problems show up locally before deploy.
function productionHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as VercelConfig
  const global = config.headers.find((rule) => rule.source === '/(.*)')
  return Object.fromEntries(
    (global?.headers ?? []).map(({ key, value }) => [key, value]),
  )
}

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: productionHeaders(),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
  },
})
