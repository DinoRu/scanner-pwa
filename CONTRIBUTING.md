# 🤝 Contributing to Event Scanner PWA

Merci de votre intérêt pour contribuer à Event Scanner PWA ! Nous accueillons toutes les contributions, qu'il s'agisse de corrections de bugs, de nouvelles fonctionnalités ou d'améliorations de la documentation.

## 📋 Table des Matières

- [Code of Conduct](#code-of-conduct)
- [Comment Contribuer](#comment-contribuer)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

---

## 📜 Code of Conduct

Ce projet adhère au [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). En participant, vous vous engagez à respecter ce code.

---

## 🚀 Comment Contribuer

### Signaler un Bug

Si vous trouvez un bug:

1. **Vérifiez** que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/dinoru/scanner-pwa/issues)
2. **Créez une issue** avec le template "Bug Report"
3. **Incluez:**
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, navigateur, version)

### Proposer une Feature

Pour proposer une nouvelle fonctionnalité:

1. **Créez une issue** avec le template "Feature Request"
2. **Décrivez:**
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives considérées
   - Impact potentiel

### Améliorer la Documentation

La documentation peut toujours être améliorée:

- Corriger les typos
- Clarifier les instructions
- Ajouter des exemples
- Traduire (si multilingue)

---

## 💻 Development Setup

### Prérequis

- Node.js 18+
- npm ou yarn
- Git

### Installation

```bash
# Fork le repo
git clone https://github.com/dinoru/scanner-pwa.git
cd scanner-pwa

# Ajouter le repo upstream
git remote add upstream https://github.com/dinoru/scanner-pwa.git

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec votre config
nano .env

# Démarrer en dev
npm run dev
```

### Structure du Projet

```
src/
├── components/      # Composants React réutilisables
├── pages/          # Pages de l'application
├── services/       # Services (API, offline)
├── App.jsx         # App principale
└── main.jsx        # Point d'entrée
```

### Scripts Disponibles

```bash
npm run dev         # Démarrer en développement
npm run build       # Build de production
npm run preview     # Preview du build
npm run lint        # Linter (si configuré)
```

---

## 🔄 Pull Request Process

### 1. Créer une Branche

```bash
# Mettre à jour main
git checkout main
git pull upstream main

# Créer une branche feature
git checkout -b feature/amazing-feature

# Ou pour un bugfix
git checkout -b fix/bug-description
```

### 2. Faire vos Changements

- **Écrire du code propre** et lisible
- **Suivre les standards** (voir ci-dessous)
- **Tester** vos changements
- **Documenter** si nécessaire

### 3. Commit

```bash
git add .
git commit -m "feat: add amazing feature"
```

Voir [Commit Messages](#commit-messages) pour le format.

### 4. Push

```bash
git push origin feature/amazing-feature
```

### 5. Créer une Pull Request

1. Aller sur GitHub
2. Cliquer sur "New Pull Request"
3. **Remplir le template**:
   - Description des changements
   - Type de changement (feature, bugfix, docs, etc.)
   - Checklist complétée
4. Lier les issues concernées
5. Soumettre

### 6. Review Process

- Un mainteneur reviewera votre PR
- Des changements peuvent être demandés
- Une fois approuvée, la PR sera mergée

---

## 📝 Coding Standards

### JavaScript/React

- **ES6+** syntax
- **Functional components** avec hooks
- **PropTypes** pour la validation (optionnel)
- **Pas de console.log** en production

```javascript
// ✅ Bon
const MyComponent = ({ title, onClose }) => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// ❌ Mauvais
class MyComponent extends React.Component {
  render() {
    return <div>Old style</div>;
  }
}
```

### CSS/Tailwind

- **Utiliser Tailwind** en priorité
- **Classes utilitaires** au lieu de CSS custom
- **Mobile-first** approach

```jsx
// ✅ Bon
<button className="btn-primary px-6 py-3 rounded-lg">
  Click me
</button>

// ❌ Mauvais
<button style={{padding: '12px 24px', background: 'blue'}}>
  Click me
</button>
```

### Naming Conventions

- **Components**: PascalCase (`QRScanner.jsx`)
- **Functions**: camelCase (`handleScan`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case pour les utilitaires (`api-service.js`)

### File Organization

```javascript
// 1. Imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Constants
const MAX_RETRIES = 3;

// 3. Component
const MyComponent = () => {
  // 3a. Hooks
  const [state, setState] = useState();
  const navigate = useNavigate();
  
  // 3b. Functions
  const handleClick = () => {
    // ...
  };
  
  // 3c. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3d. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

---

## 💬 Commit Messages

Nous utilisons le format [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation
- **style**: Formatage (pas de changement de code)
- **refactor**: Refactoring
- **perf**: Amélioration de performance
- **test**: Ajout de tests
- **chore**: Maintenance

### Exemples

```bash
# Feature
git commit -m "feat(scanner): add multi-camera support"

# Bugfix
git commit -m "fix(api): handle network timeout properly"

# Documentation
git commit -m "docs(readme): update installation steps"

# Refactor
git commit -m "refactor(components): simplify QRScanner logic"
```

### Rules

- Utiliser l'impératif présent ("add" pas "added")
- Pas de point final
- Première lettre minuscule
- Ligne de sujet < 72 caractères
- Corps du message si besoin (séparer par ligne vide)

---

## 🧪 Testing

Avant de soumettre une PR:

```bash
# Build de test
npm run build

# Vérifier qu'il n'y a pas d'erreurs
npm run preview

# Tester manuellement
# - Login
# - Scan QR code
# - Mode offline
# - Stats et historique
```

---

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PWA Docs](https://web.dev/progressive-web-apps/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎉 Recognition

Tous les contributeurs seront ajoutés à la section [Contributors](https://github.com/dinoru/scanner-pwa/graphs/contributors).

---

## ❓ Questions

Si vous avez des questions:

- 💬 Ouvrir une [Discussion](https://github.com/dinoru/scanner-pwa/discussions)
- 📧 Envoyer un email: diarra.msa@gmail.com
- 💡 Rejoindre notre [Discord](https://discord.gg/...) (si applicable)

---

## 🙏 Merci !

Merci de contribuer à Event Scanner PWA ! Chaque contribution, aussi petite soit-elle, est appréciée. 🎉

---

**Happy Coding! 🚀**