# AI Assistant for Automated Code Review

MVP d'un assistant IA pour revue de code automatisée :
- Analyse de code source multi-langages (JS/TS, Python)
- Détection de bugs, vulnérabilités (Bandit), dettes techniques, erreurs de style (flake8)
- Suggestions d'amélioration via IA (à venir)
- Intégration GitHub/GitLab

## Démarrage rapide

```bash
npm install
npm run dev
```

Pour l'analyse Python, assurez-vous que Bandit et flake8 sont installés globalement ou dans un venv accessible :

```bash
pip install bandit flake8
```

## Structure du projet

- `src/analysis/` : Analyseurs de code (ESLint, Bandit, flake8)
- `src/suggestions/` : Génération de suggestions IA
- `src/integrations/` : Intégrations GitHub/GitLab
- `src/api/` : Endpoints REST
- `src/utils/` : Fonctions utilitaires

## Endpoint principal

### POST `/api/analyze`
Analyse un extrait de code et retourne les problèmes détectés.

**Body JSON :**
```json
{
  "code": "<votre code>",
  "language": "javascript" // ou "typescript" ou "python"
}
```

**Réponse :**
```json
{
  "issues": [
    {
      "type": "vulnerability|lint|error|warning",
      "message": "...",
      "line": 2,
      "column": 5,
      "severity": "...", // pour Bandit
      "code": "..." // pour flake8
    }
  ],
  "suggestions": []
}
```

## Analyse statique prise en charge
- **JavaScript/TypeScript** : ESLint + plugins (security, promise, import, node, jsdoc, sonarjs)
- **Python** :
  - Bandit (vulnérabilités)
  - flake8 (lint/style/PEP8)

## Roadmap MVP
- [x] Initialisation du projet
- [x] Analyse statique Python/JS
- [ ] Suggestions IA
- [ ] Intégration GitHub/GitLab

## Licence
MIT
- [ ] Intégration GitHub Action

## Licence
MIT
