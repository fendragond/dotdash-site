# Convention de marquage `{{TODO:...}}`

> Définie **jour 1**. Sur ODBM, cette convention a dû être reconstruite en audit a posteriori (normalisation 2026-07-06 : 38 marqueurs, variantes divergentes à fusionner). Le starter corrige l'erreur à la source : les noms canoniques existent **avant** la première page.

## Principe

Tout emplacement qui attend une donnée client, une clé, un média ou un arbitrage porte un marqueur `{{TODO:role}}` **grep-able**. En fin de build, un `rg "\{\{TODO"` génère la checklist de collecte exhaustive à envoyer au client en un seul message structuré.

**Règle de discipline (critique) :** un trou non marqué est un trou non détecté — pire, pris pour du contenu validé. Le marquage doit être systématique et visible. C'est la condition qui fait que l'ossature-en-staging révèle les manques au lieu de les cacher sous une apparence de site fini.

## Format

```
{{TODO:role}}
```

- **`role`** = ce que l'emplacement attend, décrit par sa **fonction**, en `kebab-case`.
- **Jamais de nom de client dans le marqueur.** Le rôle suffit. (Leçon ODBM : le suffixe `-odbm` a causé la moitié des divergences — `telephone-odbm`, `url-whatsapp-odbm`… Dans un socle réutilisable, le marqueur décrit le rôle, pas le projet.)
- Un rôle = **un seul** nom canonique. Pas de synonyme. `email-officiel` OU `email-contact`, jamais les deux.
- Description libre autorisée **après** le rôle, séparée par ` — `, pour porter un arbitrage ou une note :
  ```
  {{TODO:adresse-carte — siège social par défaut ; basculer sur bureau si arbitrage GBP le décide}}
  ```

## Noms canoniques

> Liste de départ, dérivée du REX ODBM. À enrichir par projet — mais **toujours** en ajoutant un nom canonique unique, jamais une variante d'un existant.

### Contact / NAP

| Marqueur | Rôle |
|---|---|
| `{{TODO:email-officiel}}` | Email affiché publiquement |
| `{{TODO:telephone}}` | Téléphone principal, format affiché (`06 12 34 56 78`) |
| `{{TODO:telephone-tel}}` | Même numéro, format `tel:` (`+2126...`) |
| `{{TODO:telephone-secondaire}}` | Fixe / second numéro (listes contact & mentions uniquement) |
| `{{TODO:url-whatsapp}}` | Lien `https://wa.me/...` |
| `{{TODO:adresse-siege}}` | Adresse postale du siège |
| `{{TODO:adresse-carte}}` | Point affiché sur la carte (peut différer du siège — arbitrage GBP) |

### SEO / config

| Marqueur | Rôle |
|---|---|
| `{{TODO:staging-host}}` | Host de staging `*.workers.dev` (dans `public/_headers`) |
| `{{TODO:google-maps-api-key}}` | Clé `PUBLIC_GOOGLE_MAPS_API_KEY`, restreinte avant prod |
| `{{TODO:og-image-default}}` | Image OG fallback 1200×630 |
| `{{TODO:credential-*}}` | N° de certification / accréditation (ISO, JCI…) — suffixer le type |

### Médias

| Marqueur | Rôle |
|---|---|
| `{{TODO:image-*}}` | Photo à fournir — suffixer la zone (`image-hero`, `image-service-x`) |
| `{{TODO:slot-video-*}}` | Emplacement vidéo — suffixer le contexte |
| `{{TODO:liste-partenaires}}` | Logos / noms partenaires réels |

### Données à valider

| Marqueur | Rôle |
|---|---|
| `{{TODO:valider-client}}` | Copy rédigée par Claude, en attente de relecture client |
| `{{TODO:chiffre-cle-*}}` | Statistique à confirmer — suffixer (`chiffre-cle-projets`, `chiffre-cle-annees`) |

## Guard clause (exception permanente)

Un marqueur peut apparaître **en dur dans du code** comme garde anti-rendu — c'est légitime et permanent, pas un TODO à résoudre. Exemple ODBM (`team-gallery.ts`) :

```ts
return Boolean(src && !src.includes('{{TODO') && src.trim().length > 0);
```

Cette occurrence protège l'affichage : elle empêche qu'un marqueur non résolu fuie à l'écran. Elle doit être **exclue** de la checklist de collecte (elle matche `{{TODO` sans être une donnée manquante).

## Audit de fin de build

```bash
rg "\{\{TODO" src public --line-number
```

- Chaque hit = une donnée à collecter, **sauf** la guard clause ci-dessus.
- Objectif livraison : **zéro marqueur rendu à l'écran**. Les seules occurrences tolérées en prod sont les commentaires de code/data et la guard clause.
- Consigner l'état dans `docs/todo_audit.md` au moment de la livraison (snapshot daté).
