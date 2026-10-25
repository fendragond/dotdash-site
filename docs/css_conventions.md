# Conventions CSS — propriétés logiques & RTL-safety

> Règle **transverse** à tout composant du starter. Elle est ce qui rend l'arabe (ou toute langue RTL) activable par simple ajout de locale, sans refonte. Chaque prompt Cursor qui produit du style référence ce fichier.

## Principe

Le starter n'écrit **jamais** de propriété physique directionnelle (`left` / `right`). Il écrit des **propriétés logiques**, qui suivent automatiquement la direction du texte (`dir="ltr"` ou `dir="rtl"` posé sur `<html>` par le BaseLayout). En LTR elles se comportent comme d'habitude ; en RTL elles s'inversent seules.

## Table de correspondance

| ❌ Physique (interdit) | ✅ Logique (obligatoire) |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `left:` / `right:` (positionnement) | `inset-inline-start` / `inset-inline-end` |
| `text-align: left` / `right` | `text-align: start` / `end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |
| `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` |
| `top:` / `bottom:` | `inset-block-start` / `inset-block-end` |
| `border-radius: X 0 0 X` (coins L/R) | `border-start-start-radius` etc. (coins logiques) |
| `float: left` / `right` | `float: inline-start` / `inline-end` |

> Note Tailwind : les utilitaires logiques existent (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`). Utiliser ceux-là, **jamais** `ml-*` / `mr-*` / `pl-*` / `pr-*` / `left-*` / `right-*` / `text-left` / `text-right`.

## Icônes & éléments directionnels

Les propriétés logiques gèrent le **layout**, pas le **contenu graphique**. Une flèche « suivant » qui pointe à droite doit pointer à gauche en RTL. À traiter explicitement :

- Flèches / chevrons directionnels : les retourner en RTL via `[dir="rtl"] .icon-next { transform: scaleX(-1); }` (ou une classe utilitaire dédiée).
- Icônes non-directionnelles (loupe, mail, téléphone) : ne **pas** les retourner.
- Carrousels, sliders, timelines : vérifier le sens de progression en RTL.

## Ce qui reste physique (légitime)

Certaines choses n'ont pas de sens logique et restent physiques :
- `box-shadow` (l'ombre a une direction lumineuse, pas textuelle — mais penser à l'inverser si elle porte un sens directionnel fort).
- `transform: translateX()` pour des animations purement visuelles — mais préférer les inverser en RTL si elles accompagnent un flux de lecture.

## Validation RTL sans traduction arabe

On n'attend pas d'avoir du contenu arabe pour tester le RTL. Forcer temporairement la direction pour valider le layout :

```html
<!-- test manuel : forcer dir=rtl sur <html> et vérifier qu'aucun élément ne casse -->
<html lang="fr" dir="rtl">
```

Ou en dev, via les DevTools, changer l'attribut `dir` de `<html>` à `rtl` et parcourir chaque page. Tout ce qui « saute » à droite/gauche de travers révèle une propriété physique oubliée.

## Grep de contrôle

Avant tout commit de style, vérifier l'absence de propriétés physiques directionnelles :

```bash
rg -n "margin-left|margin-right|padding-left|padding-right|\bleft:|\bright:|text-align:\s*(left|right)|\bml-|\bmr-|\bpl-|\bpr-|\btext-left|\btext-right" src
```

Un hit = une propriété physique à convertir en logique (sauf exception documentée ci-dessus).
