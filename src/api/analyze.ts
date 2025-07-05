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
    if (['javascript', 'typescript'].includes(language.toLowerCase())) {
      const { issues, suggestions } = await analyzeWithESLint(code);
      return res.json({ issues, suggestions });
    }
    // TODO: Ajouter d'autres analyseurs pour d'autres langages
    // Réponse mockée pour les autres langages
    const issues = [
      { type: 'bug', message: 'Exemple de bug détecté', line: 3 },
      { type: 'vulnerability', message: 'Exemple de vulnérabilité', line: 7 }
    ];
    const suggestions = [
      { message: 'Utilisez const au lieu de var', line: 2 },
      { message: 'Factorisez ce bloc de code', line: 5 }
    ];
    return res.json({ issues, suggestions });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de l’analyse du code', details: (err as Error).message });
  }
});

export default router;
