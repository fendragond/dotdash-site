# Backlog projet — Dot & Dash Studio

> **Système 4 documents ATLASEO**
>
> - Constitution (lecture seule, non modifiable par projet) : `ATLASEO_strategy.md` + `ATLASEO_context.md`
> - Documents par projet (à cloner depuis `docs/templates/`) : **brief** + **backlog** (ce fichier)
>
> Ce backlog hérite de la constitution et du brief projet. Structure par **phases** (pas par priorité).

**Version :** v0.1 — kickoff, Discovery en cours

**Client :** Dot & Dash Studio (Loubna) · **Repo :** `fendragond/dotdash-site` (à créer) · **Statut :** Phase 1

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
- [ ] `[XS]` Décider l'auteur du `DESIGN.md` (Impeccable ou Stitch) selon le verdict du spike

---

## Phase 2 — Design / Ossature

**Objectif :** une ossature en staging que Loubna peut parcourir. C'est la base du devis et le premier jalon de paiement.

- [ ] `[XS]` Créer le Project Claude `DotDash_site` avec les 4 fichiers (strategy + context v2.2 + brief + backlog)
- [ ] `[S]` Bootstrap `fendragond/dotdash-site` depuis `atlaseo-starter` v1.0.0. Connecteur GitHub branché le jour même puis ajouté au Project. Noms `{{TODO:...}}` canoniques fixés, `_headers` noindex staging, `cursor_gotchas.md` chargé dans Cursor.
- [ ] `[M]` `DESIGN.md` : tokens couleurs, typo, radius, spacing (un seul auteur)
- [ ] `[M]` Accueil (une page = une conversation)
- [ ] `[S]` Squelettes Projets, Fiche projet, Studio, Contact (structure, contenus en `{{TODO}}`)
- [ ] `[S]` Déploiement staging `dotdash-site.fahd-d-d01.workers.dev` + grep `{{TODO` pour lister les manques
- [ ] `[XS]` 💰 Envoyer le lien staging à Loubna, recueillir ses retours

---

## Phase 3 — Build

**Objectif :** V1 complète avec les vrais contenus, validée sur staging.

- [ ] `[S]` 💰 Devis final (base + options retenues), signature et acompte
- [ ] `[M]` Projets : grille + filtres par catégorie
- [ ] `[M]` Fiche projet : galerie (lightbox starter), infos, texte
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

---

## Done

- 2026-09 — [S] Reconnexion Instagram, réunion de présentation, devis indicatif + doc réalisations & méthode envoyés.
- 2026-10 — [S] Réunion de suivi, direction design validée (Kettani / Bouhaya / Mawlawi), accord ossature puis devis.
- 2026-10-25 — [XS] Brief et backlog v0.1 générés depuis les templates du starter.

---

## Revue mensuelle

### Novembre 2026 — (à remplir)

- **Done :** (à remplir)
- **Bloqué :** (à remplir)
- **Décisions :** (à remplir)
- **Prochaine phase :** (à remplir)

---

*Fin du backlog — v0.1 — kickoff, Discovery en cours.*
