# 📱 Event Scanner PWA

> Progressive Web App pour la validation de billets d'événements en temps réel

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Application mobile-first pour les contrôleurs d'événements permettant de scanner et valider des billets via QR code, avec support offline complet.

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api)

---

## 🎯 Features

### 📷 Scan QR Code
- **Scanner haute performance** avec html5-qrcode
- **Support multi-caméras** (avant/arrière)
- **Feedback visuel et sonore** (vibration + son)
- **Ligne de scan animée** pour meilleur guidage

### ✅ Validation en Temps Réel
- **Vérification instantanée** des billets
- **Détection des doublons** (billets déjà utilisés)
- **Affichage des informations** client (nom, catégorie, place)
- **Messages d'erreur détaillés** (raison du refus)

### 📡 Mode Offline
- **Fonctionne sans internet** grâce au Service Worker
- **Queue de synchronisation** avec IndexedDB
- **Sync automatique** au retour en ligne
- **Cache intelligent** des données essentielles

### 📊 Statistiques
- **Scans du jour** en temps réel
- **Billets valides/invalides**
- **Taux de réussite**
- **Historique des 50 derniers scans**

### 📱 Progressive Web App
- **Installable** sur écran d'accueil (iOS/Android)
- **Mode standalone** (plein écran)
- **Fonctionne offline**
- **Mises à jour automatiques**
- **Icônes et splash screens**

### 🔐 Sécurité
- **Authentification JWT**
- **Rôle contrôleur uniquement**
- **Token sécurisé** dans localStorage
- **Auto-déconnexion** si token expiré

---

## 🖼️ Screenshots

### Login
<img src="docs/screenshots/login.png" width="300" alt="Login Screen">

### Scanner
<img src="docs/screenshots/scanner.png" width="300" alt="Scanner Screen">

### Résultat de Scan
<img src="docs/screenshots/result.png" width="300" alt="Scan Result">

### Statistiques
<img src="docs/screenshots/stats.png" width="300" alt="Statistics">

---

## 🛠️ Tech Stack

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| [React](https://reactjs.org/) | 18.2 | UI Framework |
| [Vite](https://vitejs.dev/) | 5.0 | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3 | Styling |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | 2.3 | QR Code Scanner |
| [axios](https://axios-http.com/) | 1.6 | HTTP Client |
| [localforage](https://localforage.github.io/localForage/) | 1.10 | Offline Storage |
| [react-router-dom](https://reactrouter.com/) | 6.20 | Routing |
| [lucide-react](https://lucide.dev/) | 0.292 | Icons |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | 0.17 | PWA Support |

---

## 📋 Prérequis

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Backend API** compatible (voir [API Requirements](#api-requirements))
- **Caméra** sur l'appareil
- **HTTPS** pour PWA en production

---

## 🚀 Installation

### 1. Clone du repo

```bash
git clone https://github.com/dinoru/scanner-pwa.git
cd scanner-pwa
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration

Créer un fichier `.env`:

```bash
cp .env.example .env
```

Éditer `.env`:

```env
# URL de votre API Backend
VITE_API_URL=https://api.votre-domaine.com/api

# Environnement
NODE_ENV=production
```

### 4. Développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3001

### 5. Build pour production

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

### 6. Preview du build

```bash
npm run preview
```

---

## 📱 Utilisation

### Connexion

1. Ouvrir l'application
2. Entrer vos identifiants contrôleur
3. Cliquer sur "Se connecter"

### Scanner un billet

1. Cliquer sur "Démarrer le scan"
2. Autoriser l'accès à la caméra (première fois)
3. Placer le QR code dans le cadre
4. Le résultat s'affiche automatiquement

### Voir l'historique

1. Cliquer sur "Historique"
2. Voir les 20 derniers scans
3. Code, client, heure affichés

### Mode Offline

- L'application fonctionne sans internet
- Les scans sont enregistrés localement
- Synchronisation automatique au retour en ligne

---

## 🔧 Configuration Avancée

### Personnaliser les couleurs

Modifier `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#VOTRE_COULEUR',
        600: '#VOTRE_COULEUR_FONCEE',
      }
    }
  }
}
```

### Changer les icônes PWA

Remplacer les fichiers dans `public/`:
- `logo192.png` (192x192)
- `logo512.png` (512x512)
- `favicon.ico` (32x32)

### Modifier le nom de l'app

Éditer `vite.config.js`:

```javascript
manifest: {
  name: 'Votre Nom',
  short_name: 'Nom Court',
  description: 'Votre description'
}
```

---

## 📡 API Requirements

### Endpoints requis

L'application nécessite les endpoints suivants:

#### 1. Authentification

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "controleur1",
  "password": "motdepasse"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "controleur1",
    "name": "Contrôleur Principal",
    "role": "controleur"
  }
}
```

#### 2. Scanner un billet

```http
POST /api/tickets/:id/scan
Authorization: Bearer {token}
```

**Réponse (succès):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Billet valide",
    "ticket": {
      "id": "DIDI-1234",
      "name": "Ivan Petrov",
      "category": "vip"
    }
  }
}
```

**Réponse (échec):**
```json
{
  "success": false,
  "data": {
    "success": false,
    "message": "Billet déjà utilisé",
    "ticket": {...}
  }
}
```

#### 3. Historique (optionnel)

```http
GET /api/tickets/scans?limit=50
Authorization: Bearer {token}
```

#### 4. Statistiques (optionnel)

```http
GET /api/tickets/stats/controller
Authorization: Bearer {token}
```

Voir [API.md](docs/API.md) pour la documentation complète.

---

## 🚢 Déploiement

### Option 1: Node.js (Simple)

```bash
npm run build
npm install -g serve
serve -s dist -p 3001
```

### Option 2: PM2 (Recommandé)

```bash
npm run build
npm install -g pm2
pm2 start npm --name "scanner-pwa" -- run preview
pm2 save
```

### Option 3: Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name scanner.votre-domaine.com;
    
    root /var/www/scanner-pwa/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 4: Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

```bash
docker build -t scanner-pwa .
docker run -d -p 3001:80 scanner-pwa
```

---

## 📱 Installation sur Mobile

### Android (Chrome)

1. Ouvrir l'app dans Chrome
2. Menu (⋮) → "Ajouter à l'écran d'accueil"
3. Confirmer
4. L'icône apparaît sur l'écran d'accueil

### iOS (Safari)

1. Ouvrir l'app dans Safari
2. Bouton Partager (carré avec flèche)
3. "Sur l'écran d'accueil"
4. Ajouter
5. L'icône apparaît sur l'écran d'accueil

---

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm test

# Build de test
npm run build

# Vérifier le build
npm run preview
```

---

## 📂 Structure du Projet

```
scanner-pwa/
├── public/                  # Assets statiques
│   ├── logo192.png
│   ├── logo512.png
│   └── manifest.json
├── src/
│   ├── components/          # Composants React
│   │   ├── QRScanner.jsx
│   │   ├── ScanResult.jsx
│   │   └── StatsCard.jsx
│   ├── pages/               # Pages
│   │   ├── LoginPage.jsx
│   │   └── ScannerPage.jsx
│   ├── services/            # Services API
│   │   ├── api.js
│   │   └── offline.js
│   ├── App.jsx              # App principale
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles
├── index.html               # HTML principal
├── vite.config.js           # Config Vite + PWA
├── tailwind.config.js       # Config Tailwind
├── package.json             # Dépendances
└── README.md                # Ce fichier
```

---

## 🐛 Dépannage

### La caméra ne fonctionne pas

**Problème:** La caméra ne démarre pas

**Solutions:**
- Utiliser HTTPS (requis pour PWA)
- Vérifier les permissions du navigateur
- Tester dans Chrome/Safari
- Redémarrer l'application

### Les scans ne se synchronisent pas

**Problème:** Mode offline ne synchronise pas

**Solutions:**
- Vérifier la connexion internet
- Cliquer sur "Actualiser"
- Vérifier les logs console
- Se reconnecter si nécessaire

### L'app ne s'installe pas

**Problème:** "Ajouter à l'écran d'accueil" absent

**Solutions:**
- Vérifier que vous utilisez HTTPS
- Vérifier le fichier manifest.json
- Utiliser Chrome/Safari
- Effacer le cache du navigateur

### Erreur CORS

**Problème:** `Access-Control-Allow-Origin` manquant

**Solution:**
```javascript
// Dans le backend
app.use(cors({
  origin: ['https://scanner.votre-domaine.com'],
  credentials: true
}));
```

---

## 🤝 Contributing

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

---

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

### Version 1.0.0 (2025-11-07)

**Features:**
- ✨ Scanner QR code avec html5-qrcode
- ✨ Validation de billets en temps réel
- ✨ Mode offline avec synchronisation
- ✨ Statistiques et historique
- ✨ PWA installable
- ✨ Support multi-caméras
- ✨ Feedback sonore/vibration

---

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 👥 Auteurs

- **Votre Nom** - *Développement initial* - [@votre-username](https://github.com/dinoru)

Voir aussi la liste des [contributeurs](https://github.com/dinoru/scanner-pwa/contributors).

---

## 🙏 Remerciements

- [html5-qrcode](https://github.com/mebjas/html5-qrcode) pour le scanner QR
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) pour le support PWA
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes

---

## 📞 Support

- 📧 Email: support@votre-domaine.com
- 💬 Issues: [GitHub Issues](https://github.com/dinoru/scanner-pwa/issues)
- 📖 Documentation: [Wiki](https://github.com/dinoru/scanner-pwa/wiki)

---

## 🔗 Liens Utiles

- [Documentation API](docs/API.md)
- [Guide de Déploiement](docs/DEPLOYMENT.md)
- [Guide de Développement](docs/DEVELOPMENT.md)
- [FAQ](docs/FAQ.md)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/dinoru">Moustapha Diarra</a>
</p>

<p align="center">
  <a href="#-didi-scanner-pwa">Retour en haut ⬆️</a>
</p>