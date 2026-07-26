# Palia Assistant — mise en ligne

## Ce que contient le dossier

| Fichier | À quoi il sert |
|---|---|
| `index.html` | L'application entière |
| `manifest.json` | Ce qui rend l'app installable : nom, icônes, couleurs |
| `service-worker.js` | Ce qui la fait marcher **sans connexion** |
| `icon-192.png` · `icon-512.png` | Icônes de l'application |
| `icon-maskable-512.png` | Icône adaptative Android (ronde, carrée, en goutte) |
| `apple-touch-icon.png` | Icône iPhone et iPad |
| `favicon-32.png` | Petite icône dans l'onglet du navigateur |

**Garde les 8 fichiers ensemble, dans le même dossier.** Ils se cherchent les uns les autres.

---

## Mettre en ligne sur GitHub Pages

1. Sur **github.com**, crée un dépôt public. Par exemple `palia-assistant`.
2. Clique sur **Add file → Upload files**, et dépose les 8 fichiers.
3. Clique sur **Commit changes**.
4. Va dans **Settings → Pages**.
5. Sous *Source*, choisis **Deploy from a branch**, branche **main**, dossier **/ (root)**. Enregistre.
6. Attends une à deux minutes. L'adresse apparaît en haut de la page :

```
https://ton-pseudo.github.io/palia-assistant/
```

C'est cette adresse qu'il faut ouvrir. Pas le fichier sur l'ordinateur.

---

## Installer l'application

Ouvre l'adresse, puis :

- **Android, Chrome** — menu ⋮ en haut à droite → *Installer l'application*
- **Windows, Chrome ou Edge** — icône ⊕ dans la barre d'adresse → *Installer*
- **iPhone, Safari** — bouton Partager ⬆️ → *Sur l'écran d'accueil*

L'application propose aussi l'installation d'elle-même, et un bouton se trouve dans **Réglages → Installer l'application**.

Une fois installée : icône sur l'écran d'accueil, ouverture en plein écran sans barre de navigateur, et **fonctionnement hors connexion**.

---

## Deux choses à savoir

**Le service worker ne marche qu'en `https`.** Si tu ouvres `index.html` par un double-clic, l'application fonctionne, mais sans installation ni mode hors ligne. C'est normal, ce n'est pas un bug.

**Quand tu mets une nouvelle version en ligne**, ouvre `service-worker.js` et change la ligne :

```js
const VERSION = 'palia-v30';
```

en `'palia-v31'`, par exemple. Sans ça, les navigateurs continueront d'afficher l'ancienne version depuis leur cache. L'application prévient alors ses utilisateurs qu'une mise à jour est prête.

---

## Où sont les données

Tout ce que ta fille saisit — niveaux, jardin, photos, calendrier — reste **dans le navigateur de son appareil**. Rien n'est envoyé nulle part, rien n'est dans le dépôt GitHub.

Conséquence : la progression ne se synchronise pas entre le téléphone et l'ordinateur. Pour passer de l'un à l'autre, utilise **Réglages → Exporter**, puis **Importer** sur l'autre appareil.

Pense à exporter de temps en temps : c'est la seule sauvegarde.

---

## La clé de l'assistant

Les boutons d'aide par l'IA (fiches d'habitants, conseils de pêche, ingrédients des recettes) ont besoin d'une clé API Anthropic, à coller dans **Réglages → Boutons d'aide**.

**Ne mets jamais cette clé dans les fichiers déposés sur GitHub.** Le dépôt est public : n'importe qui pourrait la lire et l'utiliser à tes frais. L'application la garde uniquement dans le navigateur, séparément — c'est fait exprès.

Sans clé, ces boutons disparaissent simplement et les 16 onglets continuent de fonctionner.
