// Готовит каталог release/:
//   release/
//     installer/MaxBrowser-Setup-<ver>.exe   — готовый NSIS-инсталлер
//     source/                                 — копия исходников без node_modules/dist
//     source.zip                              — то же одним архивом для GitHub Releases
//     RELEASE_NOTES.md
//
// Перед запуском убедитесь, что собран инсталлер: `npm run build:win`.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PKG = require(path.join(ROOT, 'package.json'));
const VERSION = PKG.version;

const RELEASE_DIR = path.join(ROOT, 'release');
const REL_INSTALLER = path.join(RELEASE_DIR, 'installer');
const REL_SOURCE = path.join(RELEASE_DIR, 'source');
const SRC_ZIP = path.join(RELEASE_DIR, `max-browser-${VERSION}-source.zip`);

const SOURCE_INCLUDE = [
  'main.js',
  'preload.js',
  'internal-preload.js',
  'storage.js',
  'whitelist.json',
  'package.json',
  'package-lock.json',
  'README.md',
  'LICENSE',
  '.gitignore',
  'Max_logo.svg',
  'Max_logo_outline.svg',
  'renderer',
  'scripts',
  'assets',
];

function rimraf(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dst);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dst, name));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

function copySource() {
  rimraf(REL_SOURCE);
  ensureDir(REL_SOURCE);
  for (const item of SOURCE_INCLUDE) {
    const src = path.join(ROOT, item);
    if (!fs.existsSync(src)) continue;
    copyRecursive(src, path.join(REL_SOURCE, item));
  }
  console.log('[release] исходники скопированы в', REL_SOURCE);
}

function copyInstaller() {
  ensureDir(REL_INSTALLER);
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) {
    console.warn('[release] dist/ не найден — сначала запусти `npm run build:win`.');
    return false;
  }
  let copied = 0;
  for (const name of fs.readdirSync(distDir)) {
    if (/MaxBrowser-Setup.*\.exe$/i.test(name)) {
      fs.copyFileSync(path.join(distDir, name), path.join(REL_INSTALLER, name));
      copied++;
      console.log('[release] инсталлер:', name);
    }
    if (/\.blockmap$/i.test(name) && /MaxBrowser-Setup/i.test(name)) {
      fs.copyFileSync(path.join(distDir, name), path.join(REL_INSTALLER, name));
    }
  }
  if (!copied) console.warn('[release] не нашёл MaxBrowser-Setup-*.exe в dist/');
  return copied > 0;
}

function zipSource() {
  // На Windows доступна команда `tar` (BSD-tar) и PowerShell Compress-Archive.
  // PowerShell универсальнее по результату.
  const psCmd = `Compress-Archive -Path '${REL_SOURCE}\\*' -DestinationPath '${SRC_ZIP}' -Force`;
  if (fs.existsSync(SRC_ZIP)) fs.unlinkSync(SRC_ZIP);
  const r = spawnSync('powershell', ['-NoProfile', '-Command', psCmd], { stdio: 'inherit' });
  if (r.status === 0) {
    console.log('[release] архив:', SRC_ZIP);
  } else {
    console.warn('[release] не удалось создать zip через PowerShell, статус:', r.status);
  }
}

function writeNotes() {
  const notesPath = path.join(RELEASE_DIR, 'RELEASE_NOTES.md');
  const installerName = `MaxBrowser-Setup-${VERSION}.exe`;
  const md = `# Макс Браузер ${VERSION}

Релизный артефакт от автора [@MDsays](https://github.com/MDsays).

## Состав

- \`installer/${installerName}\` — установщик для Windows x64 (NSIS).
- \`source/\` — исходные тексты без \`node_modules\` и сборочных каталогов.
- \`max-browser-${VERSION}-source.zip\` — те же исходники одним архивом.

## Установка

Запустите \`installer/${installerName}\`. Инсталлер ставится на пользователя
без прав администратора, создаёт ярлыки на рабочем столе и в меню «Пуск».

## Сборка из исходников

\`\`\`powershell
npm install
npm start                # запуск из исходников
npm run build:win        # пересобрать инсталлер
\`\`\`

## Лицензия

MIT, © 2026 MDsays.
`;
  fs.writeFileSync(notesPath, md, 'utf8');
  console.log('[release] записаны заметки релиза:', notesPath);
}

function main() {
  ensureDir(RELEASE_DIR);
  copySource();
  copyInstaller();
  zipSource();
  writeNotes();
  console.log('[release] готово →', RELEASE_DIR);
}

main();
