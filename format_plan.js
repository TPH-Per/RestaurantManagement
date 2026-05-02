const fs = require('fs');
let content = fs.readFileSync('PLAN.md', 'utf-8');
content = content.replace(/\\n/g, '\n').replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u{2014}/g, '—').replace(/\\u{2190}/g, '←').replace(/\\u{2192}/g, '→').replace(/\\u{251C}/g, '├').replace(/\\u{2500}/g, '─').replace(/\\u{2502}/g, '│').replace(/\\u{2514}/g, '└').replace(/\\u{2713}/g, '✓').replace(/\\u{2717}/g, '✗');
fs.writeFileSync('PLAN_readable.txt', content);
