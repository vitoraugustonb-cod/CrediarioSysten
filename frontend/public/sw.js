// Service Worker do Crediário Master PWA
const CACHE_NAME = 'crediario-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg'
];

// Instalação do Service Worker e pré-cache de ativos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições:
// 1. Não interceptar chamadas dinâmicas da API (login, vendas, clientes, pagamentos, etc.)
// 2. Servir ativos estáticos com estratégia Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Não interferir nas chamadas da API REST para manter sincronismo com backend/Supabase
  const apiRoutes = [
    '/login',
    '/logout',
    '/usuarios',
    '/clientes',
    '/produtos',
    '/vendas',
    '/parcelas',
    '/pagamentos',
    '/prestacao-contas',
    '/relatorios',
    '/health'
  ];

  const isApiRequest = apiRoutes.some((route) => url.pathname.startsWith(route));
  if (isApiRequest || event.request.method !== 'GET') {
    return;
  }

  // Network First: tenta a rede mais recente; se falhar (ex: offline), serve do cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
