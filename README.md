# LoL Top1 Tracker

**LoL Top1 Tracker** est une application web pour suivre vos performances dans les parties 2v2 de League of Legends.  
Cochez les champions avec lesquels vous avez terminé **top 1** et suivez votre progression grâce à une interface simple et interactive.

---

## Fonctionnalités

- Suivi de votre progression par champion.
- Barre de progression pour voir le pourcentage de champions validés.
- Barre de recherche pour filtrer rapidement les champions.
- Connexion sécurisée via **Magic Link** (pas de mot de passe requis).
- Déconnexion rapide.
- PWA installable sur mobile.
- Interface responsive et design moderne.

---

## Technologies utilisées

- [Next.js 13](https://nextjs.org/) – framework React moderne.
- [Supabase](https://supabase.com/) – backend et gestion des utilisateurs.
- [Tailwind CSS](https://tailwindcss.com/) – styles et mise en page.
- PWA – pour installer l'application sur mobile ou bureau.

---

## Installation locale

1. Clonez le dépôt :

``bash
git clone https://github.com/votre-utilisateur/LoL-Top1-Tracker.git
cd LoL-Top1-Tracker

2. Installez les dépendances :

npm install


3. Configurez vos variables d'environnement dans un fichier .env :

NEXT_PUBLIC_SUPABASE_URL=<votre_url_supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_anon_key>


4. Lancez l'application en mode développement :

npm run dev


5. Ouvrez http://localhost:3000
 dans votre navigateur.
