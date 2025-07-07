// Module de suggestions IA "rule-based" (MVP local)
// Génère des suggestions d'amélioration à partir des issues détectées

export interface Issue {
  type: string;
  message: string;
  line?: number;
  code?: string;
  severity?: string;
}

export interface Suggestion {
  message: string;
  line?: number;
  reason?: string;
}

/**
 * Génère des suggestions d'amélioration à partir des issues détectées
 * @param code Le code source analysé
 * @param issues Les issues détectées (lint, vulnérabilité, etc.)
 * @param language Langage du code ("javascript", "typescript", "python")
 */
export function generateSuggestions(
  code: string,
  issues: Issue[],
  language: string
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const issue of issues) {
    // Suggestions génériques
    if (issue.type === 'lint' && issue.code === 'E501') {
      suggestions.push({
        message: 'Votre ligne dépasse 79 caractères. Pensez à la couper pour respecter PEP8.',
        line: issue.line,
        reason: 'PEP8: longueur de ligne'
      });
    }
    if (issue.type === 'lint' && issue.code === 'F401') {
      suggestions.push({
        message: 'Un import est inutilisé. Supprimez-le pour alléger le code.',
        line: issue.line,
        reason: 'Import non utilisé'
      });
    }
    if (issue.type === 'vulnerability') {
      suggestions.push({
        message: `Corrigez la vulnérabilité détectée : ${issue.message}`,
        line: issue.line,
        reason: issue.severity ? `Gravité : ${issue.severity}` : undefined
      });
    }
    if (issue.type === 'lint' && issue.code === 'E302') {
      suggestions.push({
        message: 'Ajoutez deux lignes vides avant la déclaration d’une fonction ou classe (PEP8).',
        line: issue.line,
        reason: 'PEP8: Espacement'
      });
    }
    // JavaScript/TypeScript
    if ((language === 'javascript' || language === 'typescript') && issue.message && issue.message.includes('no-var')) {
      suggestions.push({
        message: 'Utilisez const ou let à la place de var.',
        line: issue.line,
        reason: 'Bonne pratique moderne JS/TS'
      });
    }
    // Suggestion générique si rien de spécifique
    if (suggestions.length === 0) {
      suggestions.push({
        message: `Améliorez ce code à la ligne ${issue.line ?? ''} : ${issue.message}`.trim(),
        line: issue.line
      });
    }
  }

  // Suggestions globales
  if (language === 'python' && !/def |class /.test(code)) {
    suggestions.push({
      message: 'Ajoutez des fonctions ou classes pour structurer votre code Python.',
      reason: 'Structuration'
    });
  }
  if ((language === 'javascript' || language === 'typescript') && !/function |const |let |class /.test(code)) {
    suggestions.push({
      message: 'Structurez votre code JS/TS avec des fonctions, classes ou modules.',
      reason: 'Structuration'
    });
  }

  // Suggestions avancées JS/TS :
  if (language === 'javascript' || language === 'typescript') {
    // Suggérer d’ajouter un JSDoc sur les fonctions publiques
    const jsdocRegex = /\n\s*function\s+(\w+)/g;
    let match;
    while ((match = jsdocRegex.exec(code)) !== null) {
      const funcName = match[1];
      const funcPos = match.index;
      // Vérifier s’il y a un commentaire /** ... */ juste avant
      const before = code.slice(Math.max(0, funcPos - 100), funcPos);
      if (!/\/\*\*/.test(before)) {
        suggestions.push({
          message: `Ajoutez un commentaire JSDoc à la fonction ${funcName}.`,
          reason: 'Documentation'
        });
      }
    }
    // Suggérer de retirer les console.log
    if (/console\.log/.test(code)) {
      suggestions.push({
        message: 'Retirez les console.log avant de passer en production.',
        reason: 'Nettoyage code prod'
      });
    }
    // Suggérer de refactorer les fonctions trop longues (>25 lignes)
    const funcLongues = [...code.matchAll(/function\s+\w+\s*\([^)]*\)\s*{([\s\S]*?)}|const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*?)}|let\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*?)}|class\s+\w+\s*{([\s\S]*?)}|^\s*\w+\s*:\s*function\s*\([^)]*\)\s*{([\s\S]*?)};/gm)];
    funcLongues.forEach(match => {
      for (let i = 1; i < match.length; i++) {
        if (match[i] && match[i].split('\n').length > 25) {
          suggestions.push({
            message: 'Cette fonction ou classe semble trop longue (>25 lignes), pensez à la refactorer.',
            reason: 'Lisibilité/Maintenabilité'
          });
        }
      }
    });
  }

  // Suggestions avancées Python :
  if (language === 'python') {
    // Suggérer d’ajouter un docstring sur les fonctions/classes
    const defRegex = /^(def|class)\s+(\w+)/gm;
    let match;
    while ((match = defRegex.exec(code)) !== null) {
      const defType = match[1];
      const defName = match[2];
      const defLineStart = code.slice(0, match.index).split('\n').length;
      // Chercher un docstring juste après la déclaration
      const lines = code.split('\n').slice(defLineStart, defLineStart + 3);
      if (!lines.some(l => /"""|'''/.test(l))) {
        suggestions.push({
          message: `Ajoutez un docstring à la ${defType} ${defName}.`,
          line: defLineStart,
          reason: 'Documentation Python'
        });
      }
    }
    // Suggérer d’utiliser logging au lieu de print
    if (/print\s*\(/.test(code)) {
      suggestions.push({
        message: 'Utilisez le module logging au lieu de print pour une meilleure gestion des logs.',
        reason: 'Bonne pratique Python'
      });
    }
    // Suggérer de refactorer les fonctions trop longues (>25 lignes)
    const funcLongues = [...code.matchAll(/^def\s+\w+\s*\([^)]*\):([\s\S]*?)(?=^def\s+|^class\s+|\Z)/gm)];
    funcLongues.forEach(match => {
      if (match[1] && match[1].split('\n').length > 25) {
        suggestions.push({
          message: 'Cette fonction semble trop longue (>25 lignes), pensez à la découper ou la refactorer.',
          reason: 'Lisibilité/Maintenabilité'
        });
      }
    });
  }

  return suggestions;
}

