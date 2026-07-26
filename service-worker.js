/* ============================================================
   Palia Assistant — Service Worker
   Rôle : rendre l'application utilisable sans connexion.
   Change VERSION à chaque mise à jour du fichier index.html,
   sinon les navigateurs garderont l'ancienne version en cache.
   ============================================================ */
const VERSION = 'palia-v30';
const CACHE = 'palia-assistant-' + VERSION;

/* Les fichiers indispensables au démarrage hors ligne */
const COQUILLE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

/* ---------- Installation : on met la coquille en cache ---------- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(COQUILLE).catch(() => {
        /* Si un fichier manque, on n'échoue pas : on met en cache un par un */
        return Promise.all(COQUILLE.map(u => c.add(u).catch(() => null)));
      }))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activation : on efface les anciens caches ---------- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(
        noms.filter(n => n.startsWith('palia-assistant-') && n !== CACHE)
            .map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- Requêtes ---------- */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* L'appel à l'assistant ne doit jamais être mis en cache */
  if (url.hostname === 'api.anthropic.com') return;

  /* Navigation : on sert l'application, même hors ligne */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copie = r.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copie));
          return r;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  /* Même origine : cache d'abord, puis mise à jour en arrière-plan */
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(enCache => {
        const reseau = fetch(req).then(r => {
          if (r && r.status === 200) {
            const copie = r.clone();
            caches.open(CACHE).then(c => c.put(req, copie));
          }
          return r;
        }).catch(() => enCache);
        return enCache || reseau;
      })
    );
    return;
  }

  /* Ressources externes, comme les polices : réseau, sinon cache */
  e.respondWith(
    fetch(req)
      .then(r => {
        if (r && r.status === 200) {
          const copie = r.clone();
          caches.open(CACHE).then(c => c.put(req, copie));
        }
        return r;
      })
      .catch(() => caches.match(req))
  );
});

/* ---------- Mise à jour déclenchée depuis la page ---------- */
self.addEventListener('message', e => {
  if (e.data === 'maj-maintenant') self.skipWaiting();
});
