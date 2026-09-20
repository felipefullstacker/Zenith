const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'AGENTS.md',
  'docs/AI_WORKFLOW.md',
  'docs/PROJECT_CONTEXT.md',
  'docs/CURRENT_STATE.md',
];

const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missingFiles.length > 0) {
  console.error(`Documentação obrigatória ausente: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const requiredInstructions = [
  'docs/AI_WORKFLOW.md',
  'docs/PROJECT_CONTEXT.md',
  'docs/CURRENT_STATE.md',
  'src/store/useStore.ts',
];
const missingInstructions = requiredInstructions.filter((entry) => !agents.includes(entry));

if (missingInstructions.length > 0) {
  console.error(`AGENTS.md não referencia: ${missingInstructions.join(', ')}`);
  process.exit(1);
}

console.log('Documentação obrigatória presente e referenciada em AGENTS.md.');
