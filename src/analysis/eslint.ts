import { ESLint, Linter } from 'eslint';

export async function analyzeWithESLint(code: string): Promise<{
  issues: any[];
  suggestions: any[];
}> {
  const eslint = new ESLint();

  // Analyse le code reçu (en mémoire)
  const results = await eslint.lintText(code);
  const issues = [];
  const suggestions = [];

  for (const result of results) {
    for (const msg of result.messages) {
      issues.push({
        type: msg.severity === 2 ? 'error' : 'warning',
        message: msg.message,
        ruleId: msg.ruleId,
        line: msg.line,
        column: msg.column
      });
      // Suggestion simple si fixable automatiquement
      if (msg.fix) {
        suggestions.push({
          message: `Suggestion: ${msg.message}`,
          ruleId: msg.ruleId,
          line: msg.line,
          column: msg.column
        });
      }
    }
  }

  return { issues, suggestions };
}
