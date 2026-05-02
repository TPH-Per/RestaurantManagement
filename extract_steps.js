const fs = require('fs');
let content = fs.readFileSync('PLAN_readable.txt', 'utf-8');
const matches = [...content.matchAll(/title:"(.*?)".*?c:`([\s\S]*?)`/gs)];
let out = '';
matches.forEach(m => {
  out += '=== ' + m[1] + ' ===\n' + m[2] + '\n\n';
});
fs.writeFileSync('steps.txt', out);
