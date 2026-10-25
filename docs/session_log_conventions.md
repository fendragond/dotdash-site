# Conventions session log & entrées Done

> Fiche de référence ATLASEO — versionnage et traçabilité des livraisons. S’applique au starter et aux projets clients.

## Versionnage `vX.Y`

Format d’en-tête / de clôture : **`vX.Y — description`**.

| Bump | Quand |
|---|---|
| **Y (mineur)** | Lot livré (jalon / phase fermé, décision actée, batch validé) |
| **X (majeur)** | Seuil structurant (ex. starter figé en `v1.0`, bascule prod client) |

Pas de troisième chiffre. Un bump = un état documenté, pas un commit isolé cosmétique.

## Entrée Done

Une ligne par livraison confirmée :

```
YYYY-MM-DD — [S] Description au passé de ce qui a été livré.
```

- **Date** : jour de validation (`rg` / build / review), pas le jour du premier jet.
- **Effort** : `[XS]` · `[S]` · `[M]` · `[L]` (même légende que le backlog).
- **Description** : passé, concise, factuelle — ce qui existe dans le repo, pas l’intention.

Cocher `[x]` dans le backlog **après** l’entrée Done, jamais avant.

## Commits docs

```
docs: description (vX.Y)
```

Exemples de forme : `docs: close Phase 2 ossature (v0.3)` · `docs: v0.4 — Phase 1 done + décisions`.

## Règles de commit

1. **Un concern par commit** — pas de catch-all multi-sujets.
2. **Code d’abord, docs ensuite** — le commit docs clôt le lot ; il ne précède pas le code qu’il décrit.
3. **`git add` ciblé** — jamais de stage blanket.

## Source de vérité

**Le code prime sur la checklist.** Avant de marquer Done :

1. Vérifier l’état réel (`rg`, `git ls-files`, `npm run build` si pertinent).
2. Puis seulement : entrée Done + case `[x]` + bump `vX.Y` si le lot le justifie.

Une case cochée sans preuve dans le repo est une dette, pas une livraison.
