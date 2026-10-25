# ATLASEO — Mini-backlog : Extraction du starter kit

> Chantier transverse ATLASEO — **v0.8 — (Jalon 7 — protocole de test Impeccable)** (document de travail, vit dans `docs/` du repo `atlaseo-starter`)

## Objet

Extraire d'`odbm-site` un socle Astro neutre, design-agnostique, réutilisable pour tout nouveau client — pour supprimer le pattern « cloner puis purger » et corriger patterns/bugs à un seul endroit. On part de la version éprouvée en prod (`odbm-site`) et on généralise ; on ne réécrit rien from scratch.

## Règles du chantier

- Un concern par prompt Cursor ; prompts en anglais, intent-based, avec exclusion guards et étape de validation terminale (`rg` / `npm run build`).
- « Read before acting » : lire le fichier réel d'`odbm-site` avant d'écrire le prompt d'extraction correspondant.
- Aucune donnée, aucun contenu, aucun token, aucun identifiant client (ODBM ou autre) ne subsiste dans le core.
- Composants structurels : ils consomment des tokens sans les définir. Aucune couleur / fonte / radius en dur.
- Commits séparés par concern ; commits de code puis commits de docs ; `git add` ciblé, jamais blanket-staged.
- Sync GitHub connector après chaque batch validé, avant le prompt suivant.
- i18n : le starter naît bilingue FR/EN et RTL-ready. CSS en propriétés logiques (inline/block, start/end) partout, jamais left/right. L'arabe s'active plus tard par simple ajout de locale, sans refonte.

## Légende effort

`[XS]` <1h · `[S]` 1-3h · `[M]` 3-8h · `[L]` 1-3 jours

---

## Jalon 0 — Bootstrap du repo

**Objectif :** repo vide, propre, connecté, prêt à recevoir le core.

- [x] `[S]` Créer le repo privé `fendragond/atlaseo-starter` — vide, README minimal, `.gitignore` Astro/Node
- [x] `[XS]` Brancher le GitHub connector sur le repo dès sa création — leçon ODBM : jamais de zone d'ombre code — connector au jour 1, pas en cours de route
- [x] `[XS]` Déposer ce mini-backlog dans `docs/starter_backlog.md` — le backlog vit dans le repo qu'il pilote
- [x] `[XS]` Créer la structure `docs/` vierge — templates brief + backlog client, conventions session log, à remplir aux jalons suivants

## Jalon 1 — Extraction du core technique

**Objectif :** la charpente Astro + Cloudflare durcie, sans aucune page de contenu.

- [x] `[M]` Extraire la config Astro + adapter Cloudflare — `astro.config`, output/adapter, `imageService: 'compile'` + workaround fs remap documenté
- [x] `[S]` Extraire `wrangler.jsonc` durci — `html_handling: drop-trailing-slash`, `NODE_VERSION`, `compatibility_date` ; valeurs client vidées
- [x] `[S]` Extraire `public/_headers` — règle host-matching pour déindexer le staging (pattern, pas la valeur odbm)
- [x] `[S]` Extraire la config Tailwind v4 (`@config`) + tokens neutres — structure de tokens vide/générique — le `DESIGN.md` par projet la remplit
- [x] `[S]` Poser la convention de marquage `{{TODO:...}}` + liste des noms canoniques — `docs/todo_markers.md` — définie jour 1, pas reconstruite en audit comme sur ODBM

## Jalon 2 — Composants structurels (i18n-aware, RTL-ready)

**Objectif :** les briques transverses éprouvées, généralisées, vidées de tout contenu ODBM, bilingues FR/EN et construites RTL-safe dès le premier jet.

- [x] `[M]` Config Astro i18n + routing FR/EN — locales `fr` (défaut) + `en`, routing `/fr/` + `/en/`, structure de traductions (dictionnaires ou content par locale)
- [x] `[M]` `BaseLayout` i18n-aware — `lang` + `dir` dynamiques sur `<html>` ; canonical / OG / JSON-LD Organization dérivés de `Astro.site` ; hreflang par locale ; slot GA4 ; une seule balise robots (bug doublon corrigé à la source)
- [x] `[S]` Règle CSS propriétés logiques (transverse à tout le jalon) — `margin-inline` / `padding-inline` / `inset-inline` / `text-align:start` partout ; jamais left/right — c'est ce qui rend l'arabe gratuit plus tard
- [x] `[S]` `PageHero.astro` — hero interne + watermark + eyebrow, props typées, zéro couleur en dur, CSS logique
- [x] `[S]` `CtaBand.astro` — bande CTA finale, texte et cibles en props, CSS logique
- [x] `[XS]` Sélecteur de langue — dans la Navbar, préserve la page courante entre locales
- [x] `[S]` Système toast + `reveal.ts` — toast succès/erreur (exception radius documentée), IntersectionObserver reveal
- [x] `[S]` Patterns lightbox / dialog en `<style is:global>` — leçon ODBM : styles scoped ne touchent pas le DOM créé dynamiquement
- [x] `[XS]` Navbar + Footer neutres — structure et slots ; liens, réseaux et logo alimentés par un module data générique ; icônes directionnelles retournables en RTL
- [x] `[S]` Module data générique `src/data/site.ts` + `media.ts` — `MEDIA_BASE_URL` centralisé ; schéma vide à remplir par projet ; strings par locale ; règle : aucun champ silencieux-vide

## Jalon 3 — Route contact (core minimal)

**Objectif :** le formulaire de contact générique. Périmètre volontairement minimal — le module candidature reste hors core.

- [x] `[S]` Route Worker `/api/contact` générique — `prerender=false`, `cloudflare:workers` env, Resend, validation serveur, honeypot, `result.error` checké
- [x] `[XS]` Variables d'env paramétrées — `CONTACT_EMAIL`, `RESEND_API_KEY` en placeholders + `.dev.vars.example` ; jamais de secret en dur
- [x] `[S]` Composant formulaire contact + câblage toast — POST JSON, honeypot en markup, pas de faux succès front-only

## Jalon 4 — Pages légales & templates docs

**Objectif :** le squelette réglementaire et documentaire réutilisable.

- [x] `[S]` Templates pages légales bilingues — mentions légales + politique de confidentialité CNDP en structure FR/EN, marqueurs `{{TODO:...}}` par langue, pattern noindex via head slot
- [x] `[S]` Templates brief + backlog client vierges — structure système 4 documents, prêts à cloner par projet
- [x] `[XS]` Fichier conventions de session log — versionnage `vX.Y`, format des entrées Done

## Jalon 5 — Contexte Cursor & gotchas

**Objectif :** injecter tout le REX technique pour qu'un nouveau projet démarre sans repayer les erreurs ODBM.

- [x] `[S]` Fichier `docs/cursor_gotchas.md` — consolidation des pièges techniques du REX (liste ci-dessous), chargé au bootstrap de chaque projet
  Consolidé dans `docs/cursor_gotchas.md` (source de vérité unique du REX technique ODBM). Ne pas maintenir de liste concurrente ici.

## Jalon 6 — Module CMS optionnel (hors core)

**Objectif :** packager le CMS en module opt-in — tous les projets n'en ont pas besoin (MedHealth vitrine : non).

- [x] `[M]` Documenter le module CMS Sveltia en add-on — `public/admin` (index + `config.yml`), Worker OAuth `sveltia-cms-auth`, compte `[client]-cms` dédié — `module/cms/` (admin/index.html noindex, config.example.yml générique) + `README.md` ; archi + secrets + `ALLOWED_DOMAINS` dans `docs/modules/cms.md`
- [x] `[S]` Procédure d'activation du module — checklist : OAuth App GitHub, `ALLOWED_DOMAINS`, rotate secret, 2FA compte CMS — checklist d'activation par projet en section finale de `docs/modules/cms.md`

> **Note :** ce jalon produit de la documentation et un dossier `module/` isolé, pas du code injecté dans le core. On ne l'active que projet par projet.

## Jalon 7 — Protocole de test Impeccable

**Objectif :** documenter les faits vérifiés (install, double circuit) et le protocole de test, sans intégrer Impeccable au starter tant que le spike MedHealth n'a pas rendu son verdict. L'intégration réelle est un jalon futur, conditionné au verdict.

- [x] `[S]` Créer `docs/impeccable_circuit.md` — faits vérifiés (install `npx impeccable install`, `/impeccable init`, hook pré-edit, detect CLI) + double circuit (skill sur la harness ≠ DESIGN.md dans le repo) + règle auteur unique du DESIGN.md
- [x] `[XS]` Documenter le protocole du spike MedHealth dans le même fichier — branche jetable depuis le starter, critères de verdict (deal suffisant pour l'œil PO, détecteur tenable sur Astro/Tailwind v4/RTL, DESIGN.md hérite les tokens), condition garde/jette
- [ ] `[S]` (futur, hors v1) Intégration réelle d'Impeccable — déclenchée seulement par un verdict positif du spike ; ne réécrit pas `impeccable_circuit.md` — reste ouvert au freeze v1 par design (jalon futur post-spike, pas un item manquant).

## Jalon 8 — Remontée du REX dans ATLASEO_context.md

**Objectif :** faire remonter les apprentissages ODBM dans la constitution parente — sinon on les re-découvre au 3e client.

- [x] `[M]` Prompt Cursor de MAJ chirurgicale d'`ATLASEO_context.md` — find-and-replace par ancres, ne pas réécrire le fichier ; le REX enrichit les méthodes, ne les remplace pas
  - Gotchas techniques (renvoi vers `cursor_gotchas.md`)
  - Checklist de lancement enrichie : connector GitHub au bootstrap, noms canoniques TODO jour 1, `_headers` staging, règle champ jamais vide-silencieux
  - Méthode ossature-en-staging promue de décision ODBM à méthode standard
  - Cadrage upfront des délais externes (GBP, ANRT/DNS, délivrabilité domaine neuf)

> `ATLASEO_strategy.md` : **pas de modification.** Le REX exclut volontairement le commercial ; vision et pricing non invalidés par ODBM.

> **Fait 2026-08-09 — Jalon 8 clos.** `ATLASEO_context.md` bumpé v2.2 : Resend consolidé (validé prod), pattern backend server-output, ossature-en-staging promue en méthode standard, reco CMS Decap→Sveltia, pipeline média R2, convention marqueurs {{TODO}} grep-able, checklist bootstrap jour 1, cadrage délais externes, principe system-layer-is-not-brand, Tailwind v4, caveat trailing-slash serving, readiness i18n/RTL (post-ODBM, pas un REX ODBM). Renvois techniques vers cursor_gotchas.md. strategy.md intouché. 11 commits scope-préfixés, pushés.

---

## Séquencement & articulation MedHealth

**Ordre :** jalons 0 → 8 en séquence. Les jalons 0-5 constituent le core minimal suffisant pour bootstrapper un vitrine simple ; 6-8 peuvent se faire en parallèle du premier projet client si besoin, mais restent des chantiers ATLASEO.

**i18n acté :** MedHealth sera FR + EN (arabe possible plus tard). Le starter naît donc bilingue FR/EN et RTL-ready — plus un inconnu en attente. L'arabe s'activera par simple ajout de locale, chez MedHealth ou tout futur client.

**Règle de synchronisation avec MedHealth :** aucun commit de build sur le repo client tant que le starter n'est pas figé en v1. La discovery MedHealth (front client) avance en parallèle ; seul le code attend.

---

## Décisions actées (Jalons 0-2)

> Choix pris pendant le build qui étendent ou précisent le plan v0.2. À respecter par les jalons suivants et les projets clients.

**Bootstrap & repo**
- `.gitattributes` ajouté : force LF sur `public/_redirects` et `public/_headers` (parseurs edge Cloudflare sensibles aux CRLF sous Windows).
- `docs/README.md` sert de carte du dossier (option B retenue : pas de placeholders vides).

**Core technique (J1)**
- `site:` dans `astro.config.mjs` piloté par `process.env.SITE_URL` (fallback `example.com`), jamais vidé en dur.
- `wrangler.jsonc` : `compatibility_date` récente (`2026-03-17`) + `compatibility_flags: ['nodejs_compat']` posé dès J1 en prévision de la route contact (Resend = SDK Node).
- `NODE_VERSION` matérialisé par `.nvmrc` (`22.12.0`), pas par une var wrangler.
- `borderRadius` neutre `4px` par défaut (pas `0px` — c'était une décision design ODBM, hors starter).
- `docs/todo_markers.md` : convention sans suffixe client (`{{TODO:role}}`, jamais `{{TODO:role-odbm}}`), un rôle = un nom canonique. Helper `isProvided()` = guard clause réutilisable.

**i18n & routing (J2)**
- Routing : les DEUX locales préfixées (`/fr/` + `/en/`), `fr` défaut, `prefixDefaultLocale: true`, `redirectToDefaultLocale: false` (évite le footgun de boucle de redirection Astro 6).
- Architecture pages : routes dynamiques `src/pages/[locale]/` + dictionnaires `ui.ts` — une page = un fichier, l'arabe s'ajoutera sans dupliquer aucune page.
- Slugs d'URL TRADUITS par locale via registre central `src/i18n/routes.ts` (`/fr/a-propos` ↔ `/en/about`). `switchLocalePath` est slug-aware. Ajouter une page = une `RouteKey` + une ligne dans `ROUTES`.
- Redirect racine `/` → `/fr` via `public/_redirects` (vrai 301 edge), PAS via une page Astro meta-refresh. `_redirects` s'exécute avant `_headers`.
- `--nav-h` défini une seule fois dans `:root` (`global.css`) : la hauteur navbar et l'offset `<main>` la consomment. Changer la hauteur = une valeur.
- `docs/css_conventions.md` ajouté (hors backlog) : propriétés logiques + RTL, référencé par chaque prompt de composant.

**Périmètre core (exclusions)**
- Compteurs animés `[data-counter]` : hors core (contenu de page, pas brique structurelle). `reveal.ts` est purement générique.
- Backlink agence : retiré du Footer par défaut, devenu prop optionnelle `credit` (opt-in par projet).
- Couleurs de statut (toast vert/rouge) et scrim lightbox : hex neutres en dur documentés comme sémantiques, hors charte de marque. Exception radius `4px` couche système documentée.
- Lightbox : primitive générique non câblée (`src/scripts/lightbox.ts`), la leçon `<style is:global>` encodée en primitive.

**Route contact (J3)**
- Endpoint mono-artefact : `src/pages/api/contact.ts` en `prerender=false` (route Astro SSR via l'adapter CF), pas de Worker séparé — un seul `wrangler deploy`.
- `CONTACT_FROM` ajouté aux vars (adresse d'expéditeur jamais inline) — trois vars au total : `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM`.
- Vars = secrets (`.dev.vars` local + `wrangler secret put` prod), jamais dans `vars` de `wrangler.jsonc` ; `.dev.vars.example` committé, `.dev.vars` ignoré via `!.dev.vars.example`.
- Honeypot `company` : off-screen via `inset-inline-start`, jamais `display:none` (certains bots l'ignorent). Drop silencieux : `return { ok:true }` 200 avant tout appel Resend.
- Validation serveur exercée en local (`Invoke-RestMethod`) sur deux chemins : honeypot → 200 sans Resend, email malformé → 400. Chemin succès-email NON exercé (exige clé Resend + domaine `from` vérifié) — reporté au premier projet client.

**Note connector**
- Deux repos (odbm-site + atlaseo-starter) connectés au projet Claude : les recherches peuvent mélanger les sources. En cas de doute sur l'état d'un fichier du starter, `git ls-files` tranche, pas le connector.

**Route légales & docs (J4)**
- Pages légales = pages de contenu, pas briques structurelles : construites comme pages dynamiques `src/pages/[locale]/` consommant le registre `ROUTES` (nouvelles `RouteKey` `legal-notice` + `privacy`), slugs traduits (`/fr/mentions-legales` ↔ `/en/legal-notice`, `/fr/confidentialite` ↔ `/en/privacy`). Valide le pattern d'ajout de page documenté J2.
- noindex légales via head slot BaseLayout (mécanisme balise robots unique, pas de 2e balise).
- Corps légal = `{{TODO:...}}` par langue, noms canoniques sans suffixe client ; seuls les titres/labels structurels passent par `ui.ts`.
- Templates brief + backlog vierges déposés sous `docs/templates/` (clone-par-projet), langue FR working-doc, zéro identifiant client. Backlog template = structure par phase (pas par priorité).
- Conventions de session log autonomes dans `docs/session_log_conventions.md` (choix : granularité `docs/`, pas de fusion dans README).

*Fin du mini-backlog starter — v0.8.*
