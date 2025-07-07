import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { exec } from 'child_process';

export async function analyzeWithBandit(code: string): Promise<{
  issues: any[];
}> {
  // Génère un fichier temporaire unique
  const filename = join(tmpdir(), `bandit_${randomBytes(8).toString('hex')}.py`);
  await fs.writeFile(filename, code, 'utf8');

  return new Promise((resolve, reject) => {
    exec(`bandit -f json -q ${filename}`, async (err, stdout, stderr) => {
      // Nettoyage du fichier temporaire
      await fs.unlink(filename).catch(() => {});
      if (err && !stdout) {
        return reject(new Error(stderr || err.message));
      }
      try {
        const result = JSON.parse(stdout);
        const issues = (result.results || []).map((item: any) => ({
          type: 'vulnerability',
          message: item.issue_text,
          severity: item.issue_severity,
          confidence: item.issue_confidence,
          line: item.line_number,
          test_id: item.test_id,
          test_name: item.test_name
        }));
        resolve({ issues });
      } catch (e) {
        reject(new Error('Erreur lors du parsing du rapport Bandit.'));
      }
    });
  });
}
