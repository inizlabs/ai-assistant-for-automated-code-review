import { Request, Response, Router } from 'express';

const router = Router();

/**
 * POST /api/analyze
 * Body: { code: string, language: string }
 * Returns: { issues: any[], suggestions: any[] }
 */
import { analyzeWithESLint } from '../analysis/eslint';

router.post('/', async (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language in request body.' });
  }

  try {
    const lang = language.toLowerCase();
    let issues: any[] = [];
    if (['javascript', 'typescript'].includes(lang)) {
      const { issues: eslintIssues } = await analyzeWithESLint(code);
      issues = eslintIssues;
    } else if (lang === 'python') {
      const { analyzeWithBandit } = await import('../analysis/bandit');
      const { analyzeWithFlake8 } = await import('../analysis/flake8');
      const [banditResult, flake8Result] = await Promise.all([
        analyzeWithBandit(code),
        analyzeWithFlake8(code)
      ]);
      issues = [...(banditResult.issues || []), ...(flake8Result.issues || [])];
    } else {
      // Réponse mockée pour les autres langages
      issues = [
        { type: 'bug', message: 'Exemple de bug détecté', line: 3 },
        { type: 'vulnerability', message: 'Exemple de vulnérabilité', line: 7 }
      ];
    }
    // Générer les suggestions IA rule-based
    const { generateSuggestions } = await import('../suggestions/suggest');
    const suggestions = generateSuggestions(code, issues, lang);
    return res.json({ issues, suggestions });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de l’analyse du code', details: (err as Error).message });
  }
});

export default router;
