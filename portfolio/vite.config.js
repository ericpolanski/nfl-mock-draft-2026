import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4201,
    host: true,
    allowedHosts: ['eric.ericpolanski.com', 'jhunter.ericpolanski.com', 'nfl-mock-draft.ericpolanski.com'],
  },
})
