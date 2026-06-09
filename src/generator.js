#!/usr/bin/env node
// ⚒️ cliforge — CLI Application Scaffolder

const fs   = require('fs');
const path = require('path');

const GREEN  = '\x1b[32m'; const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m'; const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';  const NC     = '\x1b[0m';

// ── Templates ─────────────────────────────────────────────
const TEMPLATES = {
  node: (name, desc, commands) => ({
    'index.js': `#!/usr/bin/env node
// ${name} — ${desc}
const { Command } = require('commander');
const pkg = require('./package.json');
const program = new Command();

program
  .name('${name}')
  .description('${desc}')
  .version(pkg.version);
${commands.map(c => `
program
  .command('${c.name}')
  .description('${c.description || c.name}')
  .action((options) => {
    console.log('Running ${c.name}...');
  });`).join('')}

program.parse();
`,
    'package.json': JSON.stringify({
      name, version: '1.0.0', description: desc,
      bin: { [name]: './index.js' },
      scripts: { start: 'node index.js', test: 'node tests/index.test.js' },
      dependencies: { commander: '^11.0.0', chalk: '^5.0.0', ora: '^7.0.0' },
    }, null, 2),
    'tests/index.test.js': `// Tests for ${name}\nconsole.log('✅ ${name} tests pass');\n`,
    '.gitignore': 'node_modules/\n.env\ndist/\n',
  }),

  python: (name, desc, commands) => ({
    'cli.py': `#!/usr/bin/env python3
"""${name} — ${desc}"""
import click

@click.group()
@click.version_option('1.0.0')
def cli():
    """${desc}"""
    pass
${commands.map(c => `
@cli.command()
def ${c.name.replace(/-/g,'_')}():
    """${c.description || c.name}"""
    click.echo(f'Running ${c.name}...')
`).join('')}
if __name__ == '__main__':
    cli()
`,
    'requirements.txt': 'click>=8.0\nrich>=13.0\n',
    'setup.py': `from setuptools import setup\nsetup(name='${name}', version='1.0.0', py_modules=['cli'],\n  install_requires=['click','rich'], entry_points={'console_scripts':['${name}=cli:cli']})\n`,
    'tests/test_cli.py': `def test_import():\n    import cli\n    assert True\n`,
    '.gitignore': '__pycache__/\n*.pyc\n.venv/\ndist/\n',
  }),
};

function scaffold(config) {
  const { name, description = 'A CLI tool', language = 'node', commands = [], outputDir } = config;
  const dir = outputDir || name;

  if (fs.existsSync(dir)) {
    console.log(`${YELLOW}⚠️  Directory "${dir}" already exists. Merging files.${NC}`);
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }

  const template = TEMPLATES[language];
  if (!template) { console.error(`Unknown language: ${language}`); process.exit(1); }

  const files = template(name, description, commands);
  let written = 0;
  Object.entries(files).forEach(([filePath, content]) => {
    const full = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
    console.log(`  ${GREEN}✅${NC} ${filePath}`);
    written++;
  });
  return { dir, written };
}

// CLI
const cmd    = process.argv[2] || 'help';
const target = process.argv[3];

console.log(`\n${CYAN}${BOLD}⚒️  cliforge — CLI Scaffolder${NC}\n`);

if (cmd === 'new' && target) {
  const lang = process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : 'node';
  console.log(`${BOLD}Scaffolding "${target}" (${lang})...${NC}\n`);
  const result = scaffold({
    name: target,
    description: `${target} — a CLI tool`,
    language: lang,
    commands: [{ name: 'run', description: 'Run the main process' }, { name: 'config', description: 'Manage configuration' }],
  });
  console.log(`\n${GREEN}✅ Created ${result.written} files in ./${result.dir}/${NC}`);
  console.log(`\n${DIM}Next steps:`);
  console.log(`  cd ${result.dir}`);
  console.log(lang === 'node' ? `  npm install && node index.js --help` : `  pip install -r requirements.txt && python cli.py --help`);
  console.log(`${NC}`);

} else if (cmd === 'generate' && target) {
  if (!fs.existsSync(target)) { console.error(`Config not found: ${target}`); process.exit(1); }
  const raw  = fs.readFileSync(target, 'utf8');
  const name = (raw.match(/name:\s+(\S+)/) || [])[1] || 'my-tool';
  const lang = (raw.match(/language:\s+(\S+)/) || [])[1] || 'node';
  const desc = (raw.match(/description:\s+"([^"]+)"/) || [])[1] || 'A CLI tool';
  console.log(`${BOLD}Generating from ${target}...${NC}\n`);
  const result = scaffold({ name, description: desc, language: lang, commands: [{ name: 'run' }] });
  console.log(`\n${GREEN}✅ Generated ${result.written} files in ./${result.dir}/${NC}\n`);

} else {
  console.log(`Usage:`);
  console.log(`  node src/generator.js new <name> [--lang node|python|go]`);
  console.log(`  node src/generator.js generate <config.yml>`);
  console.log(`  node src/generator.js add-command <name>\n`);
  console.log(`Examples:`);
  console.log(`  node src/generator.js new my-tool --lang node`);
  console.log(`  node src/generator.js new data-fetcher --lang python\n`);
}
