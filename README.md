# AI Assistant for Automated Code Review

MVP of an AI-powered automated code review assistant:
- Multi-language static code analysis (JS/TS, Python)
- Detection of bugs, vulnerabilities (Bandit), technical debt, and style errors (flake8)
- AI-powered improvement suggestions (in progress)
- GitHub/GitLab integration (planned)

## Quick Start

```bash
npm install
npm run dev
```

For Python analysis, ensure Bandit and flake8 are installed globally or in an accessible virtual environment:

```bash
pip install bandit flake8
```

## Project Structure

- `src/analysis/` : Code analyzers (ESLint, Bandit, flake8)
- `src/suggestions/` : AI-powered suggestion generation
- `src/integrations/` : GitHub/GitLab integrations
- `src/api/` : REST API endpoints
- `src/utils/` : Utility functions

## Main Endpoint

### POST `/api/analyze`
Analyzes a code snippet and returns detected issues and suggestions.

**Request body:**
```json
{
  "code": "<your code>",
  "language": "javascript" // or "typescript" or "python"
}
```

**Response:**
```json
{
  "issues": [
    {
      "type": "vulnerability|lint|error|warning",
      "message": "...",
      "line": 2,
      "column": 5,
      "severity": "...", // Bandit only
      "code": "..." // flake8 only
    }
  ],
  "suggestions": []
}
```

## Supported Static Analysis
- **JavaScript/TypeScript**: ESLint + plugins (security, promise, import, node, jsdoc, sonarjs)
- **Python**:
  - Bandit (vulnerabilities)
  - flake8 (lint/style/PEP8)

## MVP Roadmap
- [x] Project initialization
- [x] Static analysis for Python/JS
- [ ] AI-powered suggestions
- [ ] GitHub/GitLab integration
- [ ] GitHub Action integration

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
