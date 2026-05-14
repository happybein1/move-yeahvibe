# Quick Sport App 🏋️

Application de coaching sportif bilingue **FR / EN** — sans backend, 100% statique.

## Structure

```
quick-sport-app/
├── index.html          ← Page principale (sélecteur de langue inclus)
├── css/
│   └── style.css       ← Tous les styles
└── js/
    ├── data-fr.js      ← Données françaises (50 exercices sportifs + 30 senior)
    ├── data-en.js      ← English data (50 intense + 30 senior exercises)
    └── app.js          ← Logique applicative (langue, mode, génération)
```

## Fonctionnalités

- 🌍 **Bilingue FR / EN** avec bouton switcher (préférence mémorisée)
- 🔥 **Mode Sportif / Intense** — 50 exercices (cardio, force, abdos, stretching…)
- 🌿 **Mode Senior / Gym Douce** — 30 exercices doux avec notes explicatives
- 💾 **Persistance localStorage** — langue + programme mémorisés entre les sessions
- 📺 **Lien YouTube** adapté à la langue et au mode
- 📱 **Mobile-first**, fonctionne sans connexion une fois chargé

## Déploiement sur Cloudflare Pages via GitHub

1. **Pusher ce dossier** dans un repo GitHub (public ou privé)
2. Aller sur [Cloudflare Pages](https://pages.cloudflare.com/)
3. **Connecter le repo** GitHub
4. Paramètres de build :
   - **Framework preset** : `None`
   - **Build command** : *(laisser vide)*
   - **Build output directory** : `/` *(racine)*
5. Cliquer **Save and Deploy** ✅

> Aucune dépendance, aucun build tool requis. Le site est prêt à l'emploi.

## Développement local

Ouvrir `index.html` directement dans un navigateur, ou lancer un serveur local :

```bash
npx serve .
# ou
python3 -m http.server 8080
```
