# Brief projet — Dot & Dash Studio

> **Système 4 documents ATLASEO**
>
> - Constitution (lecture seule, non modifiable par projet) : `ATLASEO_strategy.md` + `ATLASEO_context.md`
> - Documents par projet (clonés depuis `docs/templates/` d'atlaseo-starter) : **brief** (ce fichier) + **backlog**
>
> Ce brief hérite de la constitution. Il ne la duplique pas et ne la contredit pas.

**Version :** v0.2 — repo bootstrappé et instancié, ossature en cours

**Client :** Dot & Dash Studio (Loubna) · **Repo :** `fendragond/dotdash-site` (bootstrappé depuis atlaseo-starter v1.0.0) · **Statut :** Ossature (Phase 2)

---

## 1. Cible & positionnement

- **Cible principale :** particuliers qui font construire ou rénover (villa, appartement) et cherchent un architecte. {{TODO:cible-principale}} *(à confirmer avec Loubna)*
- **Cible secondaire :** {{TODO:cible-secondaire}} *(pistes : commerces, bureaux, promoteurs)*
- **Positionnement / promesse :** {{TODO:positionnement}}
- **Différenciateurs :** {{TODO:differenciateurs}}
- **Ton de voix :** sobre, posé, qui laisse parler les projets. Tutoiement exclu côté site (vouvoiement visiteur).
- **Langues du site :** {{TODO:langues-site}} *(ossature en FR seul ; EN désactivé mais réactivable en une ligne via `LOCALES` dans `src/i18n/ui.ts` ; EN à confirmer avec Loubna)*

**Contexte acquisition :** contact personnel du founder, reconnecté via Instagram. Présence actuelle : Instagram uniquement, pas de site, pas de fiche Google.

---

## 2. Scope & périmètre

### Inclus

- [ ] Site vitrine portfolio, orienté image (Accueil, Projets, Fiche projet, Studio, Contact)
- [ ] Rédaction et structuration des contenus (inclus dans la base)
- [ ] Animations de base (transitions douces, apparitions au scroll)
- [ ] Pages légales FR (mentions légales + confidentialité CNDP)
- [ ] SEO de base (meta, schema, sitemap, GSC)

### Options (à trancher au devis)

- [ ] Motion avancé (parallaxe, scroll narratif)
- [ ] Pages projet détaillées en étude de cas
- [ ] SEO local renforcé + fiche Google
- [ ] Suivi & maintenance mensuelle
- [ ] Version EN
- [ ] Formulaire de contact (route `api/contact` du starter, Resend)

### Exclus / hors scope

- [ ] Création de logo / identité visuelle
- [ ] Shooting photo des réalisations
- [ ] {{TODO:hors-scope-autre}}

### Livrables attendus

| Livrable | Description | Statut |
|---|---|---|
| Ossature en staging | Home + structure des pages sur `dotdash-site.fahd-d-d01.workers.dev`, surface de validation client et jalon de paiement | À faire |
| Devis final | Base + options retenues, établi après validation de l'ossature | À faire |
| Site V1 | Pages complètes, contenus réels, SEO de base | À faire |
| Mise en production | Domaine, GSC, sitemap | À faire |

### Hypothèses & dépendances externes

- **Photos des projets** : fournies par Loubna, en HD. C'est la dépendance n°1 d'un site d'archi, à demander dès le kickoff.
- **Domaine** : {{TODO:domaine}}. Si `.ma`, délai ANRT de plusieurs semaines → découpler le build, le staging porte la QA.
- **Fiche Google** (si option retenue) : délai de vérification Google, à lancer tôt.
- **Email d'envoi** (si formulaire) : domaine neuf = délivrabilité faible au début, SPF/DKIM/DMARC dès le départ.

### Repère commercial

Devis indicatif envoyé en septembre : base 8 000 – 10 000 MAD, tarif « première collaboration » 9 500 MAD + options. Accord avec Loubna : ATLASEO monte d'abord l'ossature, puis envoie le devis ajusté aux travaux.

---

## 3. Design system

> Les tokens se définissent dans `DESIGN.md` du projet. Ici : intentions seulement, pas de valeurs en dur.

- **Direction visuelle :** sobre, photo d'abord, beaucoup de blanc, l'interface s'efface devant les projets.
- **Références / mood (validé avec Loubna en réunion) :**

| Référence | Ce qu'on en prend |
|---|---|
| Driss Kettani · drisskettani.com | Structure générale : sobriété, blanc, photo plein cadre, typo discrète |
| Yachar Bouhaya · yacharbouhaya.com | Organisation du portfolio : projets classés par catégorie, une fiche par projet |
| Atelier Mawlawi · atelier-mawlawi.com | Pages de réassurance : studio, démarche, spécialités, contact clair |

- **Tokens à poser dans `DESIGN.md` :**
  - Couleurs : {{TODO:tokens-couleurs}} *(neutre par défaut ; à recaler sur le logo de Loubna)*
  - Typo display / body / mono : {{TODO:tokens-typo}} *(piste : une sans-serif géométrique sobre ; le trio Hanken / Inter / JetBrains d'ATLASEO est trop « tech » pour un cabinet d'archi)*
  - Radius / spacing : radius quasi nul, spacing généreux. {{TODO:tokens-radius-spacing}}
- **Médias / direction photo :** photos de réalisations plein cadre, ratio 3:2 pour les couvertures, lightbox pour les galeries (primitive du starter), médias via `MEDIA_BASE_URL` si volume important.
- **Auteur du `DESIGN.md` :** {{TODO:auteur-design}} *(Impeccable ou Stitch, jamais les deux ; spike à cadrer, Impeccable proposé par défaut en cas d'égalité, circuit documenté dans `docs/impeccable_circuit.md` ; le gagnant redéfinit toutes les valeurs de tokens du starter)*

---

## 4. Sitemap

> Une ligne = une page (ou groupe). Slugs traduits par locale via le registre `src/i18n/routes.ts` du projet.

| Page / section | Slug FR | Slug EN | Notes |
|---|---|---|---|
| Accueil | `/fr` | `/en` | Hero projet phare, projets choisis, bloc studio, spécialités, CTA contact |
| Projets | `projets` | `projects` | Grille filtrable par catégorie ({{TODO:categories-projets}}) |
| Fiche projet | `projets/[slug]` | `projects/[slug]` | **Décision à prendre** : construites en V1, noindex au lancement, indexées une à une avec un vrai texte (règle context §10, leçon dryousra) |
| Studio | `studio` | `studio` | Loubna, démarche, spécialités |
| Contact | `contact` | `contact` | Coordonnées, WhatsApp, Instagram ; formulaire en option |
| Mentions légales | `mentions-legales` | `legal-notice` | noindex |
| Confidentialité | `confidentialite` | `privacy` | noindex · CNDP |

---

## 5. Contraintes techniques

- **Hébergement / runtime :** Cloudflare Workers Static Assets (défaut starter v1.0.0)
- **CMS :** non en V1. Module Sveltia opt-in à reconsidérer si Loubna veut ajouter ses projets seule.
- **Analytics :** Cloudflare Web Analytics. GA4 {{TODO:contrainte-analytics}}
- **Formulaires / email :** {{TODO:contrainte-formulaires}} *(Option A WhatsApp + mail + tel par défaut ; formulaire = option)*
- **SEO / indexation staging :** X-Robots-Tag noindex en place sur le host staging via `_headers`. Ne couvre pas les réponses générées par le Worker (404, API), sans effet sur l'indexation.
- **Sitemap :** ne contient que les pages indexables. Exclusions calculées dans `astro.config.mjs` (`NOINDEX_ROUTE_KEYS` × `LOCALES`). Les fiches projet noindex demanderont un indicateur par projet, source unique pour la meta robots et le sitemap.
- **Autres contraintes :** site très chargé en photos → optimisation images stricte, surveiller le LCP mobile (Lighthouse sur staging avant DNS).

---

## 6. Contacts client

| Rôle | Nom | Canal | Notes |
|---|---|---|---|
| Décideur | Loubna | Instagram / WhatsApp {{TODO:contact-decideur-canal}} | Contact personnel, tutoiement |
| Opérationnel / contenu | Loubna | {{TODO:contact-contenu-canal}} | Photos, textes |
| Technique / accès | {{TODO:contact-technique}} | {{TODO:contact-technique-canal}} | Domaine, DNS |
| Facturation | {{TODO:contact-facturation}} | {{TODO:contact-facturation-canal}} | |

- **Email officiel affiché :** {{TODO:email-officiel}}
- **Téléphone :** {{TODO:telephone}}
- **Adresse siège :** {{TODO:adresse-siege}} *(ville à confirmer : base des cibles SEO « architecte [ville] »)*

---

*Fin du brief — v0.2 — repo bootstrappé et instancié, ossature en cours.*
