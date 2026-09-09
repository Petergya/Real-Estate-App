const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const replacements = [
  ['hover:bg-green-700', 'hover:bg-secondary'],
  ['hover:bg-green-600', 'hover:bg-gold'],
  ['hover:bg-green-500', 'hover:bg-gold'],
  ['bg-green-600', 'bg-navy'],
  ['hover:text-green-700', 'hover:text-secondary'],
  ['hover:text-green-800', 'hover:text-navy'],
  ['hover:text-green-300', 'hover:text-gold'],
  ['text-green-600', 'text-gold'],
  ['text-green-400', 'text-gold'],
  ['text-green-100', 'text-white/80'],
  ['text-green-900', 'text-navy'],
  ['text-green-700', 'text-navy'],
  ['focus:ring-green-500', 'focus:ring-gold'],
  ['hover:border-green-500', 'hover:border-gold'],
  ['border-green-500', 'border-gold'],
  ['hover:bg-green-50', 'hover:bg-gold/10'],
  ['bg-green-50', 'bg-gold/10'],
  ['to-green-700', 'to-secondary'],
  ['border-green-200', 'border-gold/40'],
  ['border-green-300', 'border-gold/50'],
  ['border-green-100', 'border-gold/30'],
  ['bg-green-800', 'bg-navy'],
  ['hover:bg-green-500/20', 'hover:bg-gold/20'],
  ['hover:border-green-500/50', 'hover:border-gold/50'],
  ['bg-green-500/20', 'bg-gold/20'],
  ['bg-green-100', 'bg-gold/15'],
  ['#166534', '#0F2747'],
  ['min-h-screen bg-gray-50', 'min-h-screen bg-light'],
  ['text-gray-900', 'text-ink'],
  ['text-emerald-600', 'text-gold'],
];

const root = path.join(__dirname, '..', 'src');
for (const file of walk(root)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [from, to] of replacements) c = c.split(from).join(to);
  if (c !== orig) fs.writeFileSync(file, c);
}
console.log('retheme complete');
