const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.vue')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;
    
    // Replace \${ with ${
    content = content.replace(/\\\$\{(.*?)\}/g, '${$1}');
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
});
