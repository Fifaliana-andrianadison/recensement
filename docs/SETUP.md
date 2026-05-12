# Installation et déploiement — Paroasy

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvre sur `http://localhost:5173`

## Build production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `dist/`.

## Preview du build

```bash
npm run preview
```

## Scripts disponibles

| Script | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile TypeScript + build Vite |
| `npm run preview` | Prévisualise le build de production |

## Structure du projet

```
src/
├── main.tsx                # Point d'entrée React
├── App.tsx                 # Composant racine
├── index.css               # Styles Tailwind + thème + print
├── components/
│   ├── FaritraContext.tsx   # Contexte + CRUD
│   ├── Sidebar.tsx          # Barre latérale de navigation
│   ├── Navbar.tsx           # Barre de navigation supérieure
│   ├── FaritraTabs.tsx      # Aiguillage Dashboard / Faritra
│   ├── FaritraDashboard.tsx # Vue tableau de bord
│   ├── FaritraChart.tsx     # Graphique à barres SVG
│   ├── FaritraTable.tsx     # Tableau + filtres + publipostage
│   ├── PersonForm.tsx       # Formulaire modal ajout/modification
│   └── ui/                  # Composants UI (shadcn)
├── data/
│   └── faritra.ts           # Types + données statiques
└── lib/
    ├── age.ts               # Calcul âge + catégories
    └── utils.ts             # Utilitaire Tailwind (cn)
```

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI (Tabs)
- Lucide React (icons)
- class-variance-authority (CVA)
