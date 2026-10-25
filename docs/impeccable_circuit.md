# Impeccable — circuit design ATLASEO

## Objet

Impeccable est un skill design installé sur le harness (Cursor), pas un fichier commité dans le starter. Le seul artefact Impeccable qui vit dans le repo est le `DESIGN.md` du projet. Ce document enregistre l'install, le double circuit, et le protocole de test — avant toute décision d'intégration.

## Ce qui est un fait vérifié

- Install : `npx impeccable install` depuis la racine du repo ; détection auto de Cursor ; écriture des fichiers skill sous `.cursor/`. Node >= 22.12 requis (déjà la version du starter via `.nvmrc`).
- L'installeur branche aussi un hook design pre-edit natif côté Cursor : le détecteur tourne sur les éditions de fichiers UI et remonte les findings à l'agent.
- Première commande dans Cursor : `/impeccable init` écrit `PRODUCT.md` et propose un `DESIGN.md` (audience, product lane, voice, anti-références, couleurs, type, composants).
- Invocation : taper `/impeccable` puis une description en langage naturel. Pas de syntaxe de commande à mémoriser.
- Détecteur en CLI, indépendant du harness : `npx impeccable detect src/` (règles déterministes, sortie JSON disponible pour des gates CI).
- `.cursor/`, `PRODUCT.md` et `DESIGN.md` sont des artefacts projet versionnés (install projet prioritaire sur l'install globale).

## Le double circuit

- Circuit repo (Cursor) : le skill est installé sur le harness, jamais commité comme dépendance du starter. Ce qui vit dans le repo, c'est `DESIGN.md` (le référentiel) et `PRODUCT.md` (le brief design). Le hook pre-edit et la CLI `detect` font tenir la qualité à l'édition et en CI.
- Circuit project knowledge (Claude) : `DESIGN.md` est remonté dans le Claude Project client comme référentiel design, consulté avant chaque prompt design Cursor. Même rôle que le `DESIGN.md` Stitch auparavant, désormais produit et gardé par un outil déterministe.
- Règle d'auteur unique : `DESIGN.md` a un seul auteur à la fois. Soit un outil amont (Stitch) l'écrit, soit Impeccable l'écrit via new-work. Jamais deux `DESIGN.md` en cascade.

## Protocole de test (spike MedHealth)

- Le starter doit être figé en v1 avant le spike. Impeccable n'est pas intégré au starter tant que le spike n'a pas rendu un verdict.
- Terrain de test : un repo MedHealth bootstrappé depuis le starter, sur une branche jetable. Conservé si le verdict est positif, jeté sinon. Pas de pression de délai.
- Questions que le spike doit trancher — ce document n'y répond pas :
  1. Le world « deal » (planche design-system + hero) suffit-il à un product-owner pour figer une direction, ou un mockup écran-par-écran amont reste-t-il nécessaire ?
  2. Le détecteur tient-il sur la stack réelle (Astro, Tailwind v4, i18n FR/EN, propriétés logiques RTL) sans faux positifs qui combattent les règles maison ?
  3. `DESIGN.md` hérite-t-il correctement des tokens projet au lieu de les overrider ?
- Condition keep/discard : un verdict positif déclenche un **nouveau** jalon d'intégration. Il ne réécrit pas ce fichier.

> Ce document n'enregistre que des faits vérifiés et le protocole de test ; la direction Stitch vs Impeccable se tranche au spike, pas ici.
