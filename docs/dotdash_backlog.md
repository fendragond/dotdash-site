# Backlog projet — Dot & Dash Studio

> **Système 4 documents ATLASEO**
>
> - Constitution (lecture seule, non modifiable par projet) : `ATLASEO_strategy.md` + `ATLASEO_context.md`
> - Documents par projet (clonés depuis `docs/templates/` d'atlaseo-starter) : **brief** + **backlog** (ce fichier)
>
> Ce backlog hérite de la constitution et du brief projet. Structure par **phases** (pas par priorité).

**Version :** v0.2 — repo bootstrappé et instancié, ossature en cours

**Client :** Dot & Dash Studio (Loubna) · **Repo :** `fendragond/dotdash-site` · **Statut :** Phase 2

---

## Légende effort

`[XS]` <1h · `[S]` 1-3h · `[M]` 3-8h · `[L]` 1-3 jours

## Légende tags

- 📍 bloqué externe
- 💰 impact revenu
- 🚨 bloquant publication
- 🔗 référence

---

> **Ordre choisi (2026-10-25) :** Phase 2 (ossature) avant Phase 1. La Discovery part de l'ossature en staging : le `rg "\{\{TODO"` devient la liste de questions envoyée à Loubna.

## Phase 1 — Discovery

**Objectif :** lever tous les `{{TODO}}` de l'ossature avec Loubna, en un seul message structuré.

- [ ] `[XS]` 📍 Envoyer à Loubna la demande de contenus générée depuis le grep `{{TODO` : logo, photos HD des projets (nom, lieu, année, type), texte studio, coordonnées
- [ ] `[XS]` 📍 Cadrer les délais externes avec Loubna : domaine (ANRT si `.ma`), fiche Google, photos
- [ ] `[S]` Trancher avec Loubna : ville, cibles, catégories de projets, langues (FR seul ou FR + EN)
- [ ] `[XS]` Décider les fiches projet : V1 noindex puis indexation progressive (brief §4)

---

## Phase 2 — Design / Ossature

**Objectif :** une ossature en staging que Loubna peut parcourir. C'est la base du devis et le premier jalon de paiement.

- [ ] `[S]` Spike `DESIGN.md` : Stitch vs Impeccable, 1h30 chacun, même pack d'entrée, critères fixés en session du 2026-10-25. Le perdant est écarté en entier.
- [ ] `[M]` `DESIGN.md` : tokens couleurs, typo, radius, spacing (un seul auteur). Toutes les valeurs de tokens héritées du starter sont redéfinies, vérification par comparaison avec le starter.
- [ ] `[M]` Accueil (une page = une conversation)
- [ ] `[S]` Squelettes Projets, Fiche projet, Studio, Contact (structure, contenus en `{{TODO}}`). Navigation refaite selon le sitemap du brief : retirer À propos, ajouter Projets et Studio. Favicon dérivé du logo.
- [ ] `[S]` Déploiement staging `dotdash-site.fahd-d-d01.workers.dev` + grep `{{TODO` pour lister les manques
- [ ] `[XS]` 💰 Envoyer le lien staging à Loubna, recueillir ses retours

---

## Phase 3 — Build

**Objectif :** V1 complète avec les vrais contenus, validée sur staging.

- [ ] `[S]` 💰 Devis final (base + options retenues), signature et acompte
- [ ] `[M]` Projets : grille + filtres par catégorie
- [ ] `[M]` Fiche projet : galerie (lightbox starter), infos, texte. Noindex porté par un indicateur par projet, lu par la meta robots et par le filtre du sitemap (`NOINDEX_ROUTE_KEYS` ne suffit pas pour des pages dynamiques).
- [ ] `[S]` Studio
- [ ] `[S]` Contact (+ formulaire si option retenue, chemin succès Resend à valider)
- [ ] `[S]` Pages légales : corps des `{{TODO}}` remplis
- [ ] `[S]` Schema Organization + LocalBusiness, sitemap, meta par page
- [ ] `[M]` Option motion avancé (si retenue)
- [ ] `[M]` 🚨 QA mobile + desktop, zéro `{{TODO` restant, Lighthouse staging ≥90 mobile / ≥95 desktop

---

## Phase 4 — Livraison

**Objectif :** mise en ligne propre et indexation rapide.

- [ ] `[S]` 📍 Domaine + custom domain Cloudflare + redirect www → apex
- [ ] `[XS]` 🚨 Retirer le noindex staging sur le host de prod, garder noindex sur les fiches projet non rédigées
- [ ] `[S]` 🚨 GSC vérifié + sitemap soumis le jour même
- [ ] `[M]` 📍 Fiche Google (si option retenue)
- [ ] `[XS]` Indexation J+7 / J+14 / J+30
- [ ] `[S]` Ajouter Dot & Dash aux réalisations atlaseo.ma (avec accord de Loubna)
- [ ] `[S]` REX de clôture : technique → `cursor_gotchas.md`, méthode → `ATLASEO_context.md`

---

## Inbox

> Idées / demandes non encore phasées. Traiter en revue, pas en cours de session.

- [ ] Module CMS Sveltia si Loubna veut gérer ses projets seule
- [ ] REX starter : valeurs de tokens par défaut dérivées d'ODBM ; le starter devrait livrer des valeurs neutres (gris, typo système) pour qu'aucun projet ne démarre avec l'identité d'un autre client
- [ ] REX starter : 18 vulnérabilités npm à traiter dans atlaseo-starter (jamais d'`npm audit fix --force` côté projet)
- [ ] REX starter : montée de version Astro 7, à faire dans le starter avant les projets
- [ ] REX starter : exclusion du sitemap sans préfixe de locale (bug corrigé sur dotdash, à remonter)
- [ ] REX starter : nom du site codé en dur dans Navbar et Footer, marqueur brut écrit dans `og:image`, conteneur vide du sélecteur de langue en monolingue (corrigés sur dotdash, à remonter)
- [ ] REX starter : ids DOM préfixés `atlaseo-` dans `lightbox.ts` et `toast.ts`, à neutraliser
- [ ] REX starter : rendre explicite dans `todo_markers.md` la convention de préfixe `url-` pour les liens (seul `url-whatsapp` y figure)
- [ ] REX méthode : ne jamais commiter `ATLASEO_strategy.md` dans un repo client (prix internes, autres clients) ; il reste dans le Project

---

## Done

- 2026-09 — [S] Reconnexion Instagram, réunion de présentation, devis indicatif + doc réalisations & méthode envoyés.
- 2026-10 — [S] Réunion de suivi, direction design validée (Kettani / Bouhaya / Mawlawi), accord ossature puis devis.
- 2026-10-25 — [XS] Brief et backlog v0.1 générés depuis les templates du starter.
- 2026-10-25 — [XS] Project Claude `DotDash_site` créé avec les 4 fichiers.
- 2026-10-25 — [S] Repo `fendragond/dotdash-site` bootstrappé depuis atlaseo-starter v1.0.0, historique git neuf.
- 2026-10-26 — [S] Instanciation : nom `dotdash-site`, noindex staging, FR seul avec EN réactivable, identité Dot & Dash en marqueurs canoniques, docs nettoyées, README projet, sitemap limité aux pages indexables.
- 2026-10-26 — [XS] Connecteur GitHub branché sur `dotdash-site` et synchronisé dans le Project.

---

## Revue mensuelle

### Novembre 2026 — (à remplir)

- **Done :** (à remplir)
- **Bloqué :** (à remplir)
- **Décisions :** (à remplir)
- **Prochaine phase :** (à remplir)

---

*Fin du backlog — v0.2 — repo bootstrappé et instancié, ossature en cours.*
