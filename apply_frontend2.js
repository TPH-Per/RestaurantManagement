const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('steps.txt', 'utf-8');
const lines = content.split('\n');

let currentFile = null;
let currentContent = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for comments indicating a file path with an extension
    const fileMatch = line.match(/\/\/\s*(frontend\/src\/[^\s]+\.(?:ts|vue))/);
    
    // Special check for ClientOrderPage and others that might not have a comment exactly matching
    // Actually, all of them have comments in steps.txt like:
    // // frontend/src/pages/client/ClientOrderPage.vue
    
    if (fileMatch) {
        // Save previous file if exists
        if (currentFile && currentContent.length > 0) {
            const realPath = path.join(__dirname, currentFile);
            fs.mkdirSync(path.dirname(realPath), { recursive: true });
            
            // Clean up any remaining trailing lines or === markers
            let text = currentContent.join('\n').trim();
            if (text.startsWith('// BUG')) {
                // Remove the bug explanation part for ClientOrderPage.vue
                text = text.replace(/\/\/ BUG.*?(?=<script)/s, '').trim();
            }
            
            fs.writeFileSync(realPath, text);
            console.log('Wrote ' + currentFile);
        }
        
        currentFile = fileMatch[1];
        currentContent = [];
        continue;
    }
    
    if (currentFile) {
        if (line.startsWith('=== ')) {
            // Ignore headers
        } else {
            currentContent.push(line);
        }
    }
}

if (currentFile && currentContent.length > 0) {
    const realPath = path.join(__dirname, currentFile);
    fs.mkdirSync(path.dirname(realPath), { recursive: true });
    
    let text = currentContent.join('\n').trim();
    if (text.startsWith('// BUG')) {
        text = text.replace(/\/\/ BUG.*?(?=<script)/s, '').trim();
    }
    
    fs.writeFileSync(realPath, text);
    console.log('Wrote ' + currentFile);
}
