# dotdash-site

Site vitrine de Dot & Dash Studio, cabinet d'architecture. Projet ATLASEO, initialisé depuis atlaseo-starter v1.0.0.

## Statut

Ossature en cours, site non publié.

- Staging : https://dotdash-site.fahd-d-d01.workers.dev (non indexé)
- Production : domaine non choisi, voir docs/dotdash_brief.md

## Stack

Astro et Tailwind CSS v4, hébergés sur Cloudflare Workers Static Assets, déployés avec Wrangler.

## Commandes

Sous PowerShell, une commande par ligne, sans enchaînement avec &&.

```shell
npm install
npm run dev
npm run build
npx wrangler deploy
```

Toujours lancer npm run build avant npx wrangler deploy. Vérifier ensuite le staging en navigation privée.

## Langues

Le site est publié en français seulement, sous le préfixe /fr. L'anglais est désactivé mais conservé : les slugs de src/i18n/routes.ts, les textes de src/i18n/ui.ts et le routage par préfixe restent en place.

Pour réactiver l'anglais : remplacer `LOCALES = ['fr']` par `LOCALES = ['fr', 'en']` dans src/i18n/ui.ts, ce qui rétablit d'un coup les pages /en, le sélecteur de langue, les balises hreflang et les URLs anglaises du sitemap.

## Documentation

- docs/dotdash_brief.md : décisions du projet
- docs/dotdash_backlog.md : tâches, par phase
- docs/README.md : index de la documentation héritée du starter
- docs/cursor_gotchas.md : pièges techniques connus
- docs/todo_markers.md : convention des marqueurs TODO
- module/cms : module CMS optionnel, non activé

## Données en attente

Toute donnée en attente de la cliente est marquée dans le code par {{TODO:nom}}. Aucun champ ne reste vide sans marqueur.

Pour lister ce qui manque :

```shell
rg "\{\{TODO" --glob "!docs/**" --glob "!README.md"
```

Noms canoniques. Un rôle, un nom. La liste s'enrichit page par page.

| Nom | Rôle |
|---|---|
| domaine | domaine de production |
| telephone | téléphone affiché |
| telephone-tel | même numéro au format tel:, pour les liens d'appel |
| url-whatsapp | lien WhatsApp (wa.me) |
| email-officiel | email affiché |
| adresse-siege | adresse du studio |
| ville | ville du studio, base du SEO local |
| url-instagram | lien du compte Instagram |
| logo | fichier du logo |
| og-image-default | image de partage par défaut |
| description-studio | description courte du studio, meta par défaut |
| accroche | phrase d'accroche du pied de page |
