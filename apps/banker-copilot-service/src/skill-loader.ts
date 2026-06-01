/**
 * Reads the apps/banker-copilot/ markdown files (skills + slash commands)
 * and exposes them as runtime metadata. Skills become the system prompt;
 * commands become callable workflow entry points.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export interface SkillFile {
  name: string;
  description: string;
  body: string;
  path: string;
}

export interface CommandFile {
  name: string;
  body: string;
  path: string;
}

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const COPILOT_DIR = path.join(REPO_ROOT, 'apps', 'banker-copilot');

export async function loadSkills(): Promise<SkillFile[]> {
  const skillsDir = path.join(COPILOT_DIR, 'skills');
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills: SkillFile[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file = path.join(skillsDir, e.name, 'SKILL.md');
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = matter(raw);
      const fm = parsed.data as Record<string, unknown>;
      skills.push({
        name: (fm.name as string) ?? e.name,
        description: (fm.description as string) ?? '',
        body: parsed.content,
        path: file,
      });
    } catch (err) {
      console.warn(`[skill-loader] Could not read ${file}:`, err);
    }
  }
  return skills;
}

export async function loadCommands(): Promise<CommandFile[]> {
  const cmdDir = path.join(COPILOT_DIR, 'commands');
  let entries: string[] = [];
  try {
    entries = await fs.readdir(cmdDir);
  } catch {
    return [];
  }
  const cmds: CommandFile[] = [];
  for (const file of entries) {
    if (!file.endsWith('.md')) continue;
    const fullPath = path.join(cmdDir, file);
    const body = await fs.readFile(fullPath, 'utf8');
    cmds.push({
      name: file.replace(/\.md$/, ''),
      body,
      path: fullPath,
    });
  }
  return cmds;
}

/** Resolve a slash command name (e.g. "/credit-memo APP-001") to its CommandFile. */
export function findCommand(commands: CommandFile[], slashInput: string): { cmd: CommandFile; args: string } | null {
  const m = slashInput.match(/^\s*\/(\S+)\s*(.*)$/);
  if (!m) return null;
  const [, name, args] = m;
  const cmd = commands.find((c) => c.name === name);
  return cmd ? { cmd, args: args.trim() } : null;
}
