import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { exec } from 'child_process';

export async function analyzeWithFlake8(code: string): Promise<{
  issues: any[];
}> {
  // Génère un fichier temporaire unique
  const filename = join(tmpdir(), `flake8_${randomBytes(8).toString('hex')}.py`);
  await fs.writeFile(filename, code, 'utf8');

  return new Promise((resolve, reject) => {
    exec(`flake8 --format='%(row)d,%(col)d,%(code)s,%(text)s' ${filename}`, async (err, stdout, stderr) => {
      // Nettoyage du fichier temporaire
      await fs.unlink(filename).catch(() => {});
      if (err && err.code !== 1 && !stdout) {
        // code 1 = lint errors found, ce n'est pas une vraie erreur ici
        return reject(new Error(stderr || err.message));
      }
      try {
        const issues = (stdout || '').split(/\r?\n/)
          .filter(Boolean)
          .map(line => {
            const [lineNum, colNum, code, ...rest] = line.split(',');
            return {
              type: 'lint',
              code,
              message: rest.join(',').trim(),
              line: Number(lineNum),
              column: Number(colNum)
            };
          });
        resolve({ issues });
      } catch (e) {
        reject(new Error('Erreur lors du parsing du rapport flake8.'));
      }
    });
  });
}
