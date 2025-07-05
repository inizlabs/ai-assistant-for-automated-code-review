import { Request, Response, Router } from 'express';

const router = Router();

/**
 * POST /api/analyze
 * Body: { code: string, language: string }
 * Returns: { issues: any[], suggestions: any[] }
 */
router.post('/', async (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language in request body.' });
  }

  // TODO: Appeler les analyseurs statiques selon le langage
  // Pour le MVP, on retourne une réponse mockée
  const issues = [
    { type: 'bug', message: 'Exemple de bug détecté', line: 3 },
    { type: 'vulnerability', message: 'Exemple de vulnérabilité', line: 7 }
  ];
  const suggestions = [
    { message: 'Utilisez const au lieu de var', line: 2 },
    { message: 'Factorisez ce bloc de code', line: 5 }
  ];

  return res.json({ issues, suggestions });
});

export default router;
