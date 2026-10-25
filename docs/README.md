# docs/ — Documentation du starter ATLASEO

Ce dossier pilote l'extraction et l'usage du starter. Chaque fichier arrive à un jalon précis du backlog.

## État du dossier

| Fichier | Rôle | Jalon | État |
|---|---|---|---|
| `starter_backlog.md` | Backlog d'extraction du starter | J0 | ✅ Déposé |
| `README.md` | Carte du dossier (ce fichier) | J0 | ✅ Déposé |
| `todo_markers.md` | Convention `{{TODO:...}}` + noms canoniques | J1 | ⏳ À venir |
| `cursor_gotchas.md` | REX technique consolidé (pièges ODBM) | J5 | ⏳ À venir |
| `templates/brief_template.md` | Template brief client vierge — à cloner par projet | J4 | ✅ Déposé |
| `templates/backlog_template.md` | Template backlog client vierge — à cloner par projet | J4 | ✅ Déposé |
| `session_log_conventions.md` | Format de versionnage + entrées Done | J4 | ✅ Déposé |
| `impeccable_circuit.md` | Faits vérifiés + double circuit + protocole de test spike | J7 | ✅ Déposé |

## Principe

Le backlog vit dans le repo qu'il pilote. Les templates client (`templates/`) sont clonés par projet, jamais remplis ici. Le REX technique (`cursor_gotchas.md`) est chargé au bootstrap de chaque nouveau projet Cursor.
