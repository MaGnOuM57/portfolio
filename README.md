# Jordan Fausta - Portfolio

> **Expert Business Intelligence & Automation**  
> *Transformer la donnée complexe en levier de croissance.*

Bienvenue sur le code source de mon portfolio professionnel. Ce projet n'est pas qu'une vitrine, c'est une démonstration technique de mes compétences en **Full Stack Development**, **Finance de Marché** et **Automatisation**.

🌐 **Live Demo:** [jordanfausta.com](https://jordanfausta.com)

---

## 🏗 Architecture & Stack Technique

Ce portfolio est construit comme une véritable **Single Page Application (SPA)** moderne, optimisée pour la performance et la sécurité.

### Frontend (UX/UI)
- **React 18 + Vite** : Pour une rapidité d'exécution instantanée.
- **TailwindCSS** : Design System sur-mesure, responsive et "Pixel Perfect".
- **Framer Motion** : Animations fluides (Timeline, Transitions de pages) pour l'expérience utilisateur.
- **Recharts** : Visualisation de données financières complexes (Trading charts).
- **i18n** : Internationalisation complète (Français / Anglais).

### Backend (Serverless & Security)
- **Vercel Serverless Functions** : Architecture "Backend-for-Frontend" (BFF).
- **API Proxy Pattern** : Sécurisation totale des clés API (Alpaca Trading). Le frontend ne contient **aucun secret**, tout passe par un proxy côté serveur.
- **Alpaca Markets API** : Connexion en temps réel aux marchés financiers (mode Paper Trading pour la démo).

### Data & Content
- **Architecture de Données Centralisée** : Gestion des projets via un "Single Source of Truth" (`src/data/projects.jsx`) pour garantir la cohérence des données à travers l'application.

---

## 🚀 Fonctionnalités Clés

### 1. Algo Trading Dashboard (Live)
Connexion en direct à l'API Alpaca pour afficher les performances d'un algorithme de trading Momentum.
- Calcul de KPIs en temps réel (Sharpe Ratio, Alpha, Beta).
- Graphiques interactifs comparant la performance vs S&P 500.

### 2. Tokenisation Platform (POC)
Prototype haute-fidélité d'une plateforme d'investissement RWA (Real World Assets).
- Simulation de transactions Blockchain.
- Interface Investisseur vs Interface Admin.

### 3. Job Monitor
Agrégateur d'offres d'emploi multi-sources.
- Filtrage intelligent et calcul de "Match Score".

---

## 🛠 Installation & Développement

```bash
# Cloner le projet
git clone https://github.com/MaGnOuM57/portfolio.git

# Installer les dépendances
npm install

# Lancer en local
npm run dev
```

## 🔒 Sécurité

Ce projet utilise un modèle de sécurité strict. Les clés API (Alpaca, Supabase) ne sont **JAMAIS** exposées côté client.
En local, elles sont stockées dans un fichier `.env` (non versionné). En production, elles sont injectées via les variables d'environnement Vercel.

---

*© 2026 Jordan Fausta. Tous droits réservés.*
