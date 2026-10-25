# Cursor gotchas — REX technique ODBM

> Pièges techniques éprouvés en production sur ODBM (premier projet ATLASEO). Chargé au bootstrap de chaque nouveau projet client. Chaque entrée = le piège, puis le correctif.

## Astro & rendering
- Les styles `<style>` scoped ne s'appliquent jamais au DOM créé en JS (`createElement` n'a pas l'attribut `data-astro-cid`). Symptôme : styles silencieusement morts, élément non stylé. Lightbox / modale / UI injectée runtime → `<style is:global>`.
- Sortir du tout-statique sans perdre le prerender : `output: 'server'` dans la config + `export const prerender = true;` en tête de chaque page, `prerender = false` sur les seules routes API.
- `imageService: 'compile'` requis en hosting statique (pas d'endpoint `/_image` runtime). Bug connu avec `preserveBuildClientDir` : le compile lit `dist/_astro/` alors que les assets vont dans `dist/client/_astro/` → ENOENT. Patch fs de remap laissé en place et commenté. À revisiter à chaque upgrade `@astrojs/cloudflare` ou `astro`.
- `Astro.locals.runtime.env` supprimé en Astro 6 → `import { env } from 'cloudflare:workers'`.
- i18n : `redirectToDefaultLocale: false` pour éviter la boucle de redirection Astro 6.

## Cloudflare serving
- `trailingSlash` Astro = dev only. Le serving Cloudflare redirige `/page` → `/page/` même avec `trailingSlash: 'never'`. Fix : `"html_handling": "drop-trailing-slash"` dans le bloc assets de `wrangler.jsonc`. Vérifier sur chaque projet : URL servie = URL canonique.
- Activer `Always Use HTTPS` côté Cloudflare (fix infra à faire avant soumission GSC).
- Pages prerendered servies par l'assets layer avant le Worker : les headers du middleware n'atteignent jamais le HTML statique. Headers via `public/_headers`, jamais via middleware.

## Local dev & Windows
- `npm run preview` renvoie 404 avec l'adapter Cloudflare. Utiliser `npx wrangler dev --local`. Wrangler ne rebuild pas Astro : lancer `npm run build` avant.
- PowerShell alias `curl` → `Invoke-WebRequest`. Utiliser `Invoke-RestMethod` pour tester les routes API.
- Cache `.wrangler` bloqué : `wrangler dev` peut pointer sur un chemin de build mort (`.wrangler/deploy/config.json`) ou tenir des locks `.sqlite` (node/workerd encore actifs). Remède : `Stop-Process` node/workerd → `Remove-Item -Recurse -Force .wrangler` → `Remove-Item dist` → `npm run build`.

## Resend & email
- Le SDK Resend ne throw pas toujours en cas d'échec : vérifier `result.error` à chaque envoi.
- Au branchement domaine, le scan DNS automatique rate le MX `send` de Resend : le rajouter à la main.
- Délivrabilité domaine neuf : Hotmail/Outlook filtre agressivement le transactionnel avec PJ. Tester en conditions réelles avant prod. DMARC en `p=none` au départ, passer à `p=quarantine` une fois la délivrabilité stabilisée.

## GSC / GA4 / analytics
- « Impossible de récupérer le sitemap » sur domaine neuf juste après soumission = faux négatif quasi systématique, se résout seul. Ne pas debugger avant d'avoir vérifié robots.txt et désactivé Bot Fight Mode Cloudflare.
- Firefox bloque GA4 par défaut (anti-pistage, surtout en navigation privée) : un tag correct peut sembler mort. Valider le Temps réel sur un navigateur sans protection ni extensions.

## R2 & médias
- Uploads via wrangler avec le flag `--remote` (sinon envoi vers le simulateur local).
- Servir les médias via custom domain, jamais une URL `pub-*.r2.dev` dans le code : elles sont throttlées, à garder en fallback seulement.
- Cloudflare Stream écarté pour un vitrine (pas de free tier) : R2 self-hosting compressé est le pattern standard.

## Sveltia CMS (module opt-in — voir jalon 6)
- Widgets `list` sans clé `name` : sérialisation en strings YAML plates, pas en objets.
- L'OAuth GitHub sans backend (PKCE) n'existe pas : prévoir un Worker OAuth dédié + un compte GitHub dédié.

## Data model & marqueurs
- Aucun champ silencieux-vide : un champ non marqué fait fuiter un `{{TODO}}` brut en prod (cas MOA sur les cartes projet ODBM, retiré en catastrophe le jour de livraison). Tout champ absent = marqueur visible via `isProvided()`, ou champ retiré du modèle.
- Marqueurs `{{TODO:...}}` : noms canoniques dès le jour 1, sans suffixe client. Sur ODBM, l'absence de normalisation a imposé un audit grep correctif a posteriori.

## RTL
- `dir` sur `<html>`, icônes et flèches directionnelles à retourner. Tester le layout en forçant `dir="rtl"` même sans contenu arabe.

## Process
- Valider le rendu navigateur avant d'empiler les passes de spacing CSS. Sur ODBM, plusieurs passes ont été empilées avant d'identifier les causes racines (débordement email = `break-words` manquant, déséquilibre colonnes = adresse longue).
