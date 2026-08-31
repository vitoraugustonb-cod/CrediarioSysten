import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/login': 'http://localhost:3300',
      '/usuarios': 'http://localhost:3300',
      '/clientes': 'http://localhost:3300',
      '/produtos': 'http://localhost:3300',
      '/vendas': 'http://localhost:3300',
      '/parcelas': 'http://localhost:3300',
      '/prestacao-contas': 'http://localhost:3300',
      '/relatorios': 'http://localhost:3300',
      '/pagamentos': 'http://localhost:3300',
      '/health': 'http://localhost:3300',
    },
  },
})
