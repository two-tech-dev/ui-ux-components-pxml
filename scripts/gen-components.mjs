// Generate real, importable React component .tsx files for every base component
// declared in components/*.xml.  The XML already specifies the exact output path
// (e.g. components/ui/layout/Container.tsx) and the default-export component name
// (e.g. `Container`).  We emit a minimal-but-valid functional component so that
// projects which `import { Container } from '@/components/ui/layout/Container'`
// resolve successfully.  Consumers (or the AI) can later override/extend these.
//
// Run:  node scripts/gen-components.mjs

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const componentsDir = path.join(root, 'components');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function extractNodes(xml) {
  const blocks = xml.match(/<node[\s\S]*?<\/node>/g) || [];
  const nodes = [];
  for (const block of blocks) {
    const idMatch = block.match(/<node\s+id="([^"]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    const pathMatch = block.match(/<path>([^<]+)<\/path>/);
    if (!pathMatch) continue;
    const outPath = pathMatch[1].trim();
    if (!outPath.endsWith('.tsx')) continue;
    const staticMatch = block.match(/<constraint[^>]*verify="static"[^>]*>Export default React component `(\w+)`([\s\S]*?)<\/constraint>/);
    const name = staticMatch ? staticMatch[1] : capitalize(id.split(/[:/]/).pop());
    nodes.push({ id, name, outPath });
  }
  return nodes;
}

function renderComponent(node) {
  const tag = node.name.toLowerCase() === 'button' ? 'button' : 'div';
  return `import * as React from 'react';

export interface ${node.name}Props {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Base component generated from the pxml UI/UX library spec.
// Override or extend this file to apply custom styling/behavior.
export default function ${node.name}({ children, className, ...rest }: ${node.name}Props) {
  return (
    <${tag} className={className} {...rest}>
      {children}
    </${tag}>
  );
}
`;
}

function main() {
  if (!fs.existsSync(componentsDir)) {
    console.error('No components/ directory found.');
    process.exit(1);
  }
  const xmlFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.xml'));
  let count = 0;
  for (const file of xmlFiles) {
    const xml = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
    const nodes = extractNodes(xml);
    for (const node of nodes) {
      const abs = path.resolve(root, node.outPath);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, renderComponent(node));
      count++;
    }
  }
  console.log(`Generated ${count} component files.`);
}

main();
