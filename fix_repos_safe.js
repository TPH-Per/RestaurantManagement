const fs = require('fs');
const path = require('path');

const interfacesDir = 'RestaurantMS/src/RestaurantMS.Application/Interfaces';
const reposDir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

const interfaceFiles = fs.readdirSync(interfacesDir).filter(f => f.endsWith('Repository.cs'));

interfaceFiles.forEach(ifile => {
    const iContent = fs.readFileSync(path.join(interfacesDir, ifile), 'utf-8');
    const repoFile = ifile.substring(1); 
    
    const repoPath = path.join(reposDir, repoFile);
    if (!fs.existsSync(repoPath)) return;
    
    let rContent = fs.readFileSync(repoPath, 'utf-8');
    let addedMethods = '';

    const methods = [...iContent.matchAll(/Task(?:<(.+?)>)?\s+([A-Za-z0-9_]+)\s*\(([^)]*)\);/g)];
    methods.forEach(m => {
        const returnType = m[1] || '';
        const methodName = m[2];
        const parameters = m[3];
        
        if (!rContent.includes(' ' + methodName + '(')) {
            let ret = '';
            if (returnType === 'long' || returnType === 'int') ret = 'return 0;';
            else if (returnType === 'bool') ret = 'return false;';
            else if (returnType.includes('IEnumerable')) ret = 'return new List<' + returnType.replace(/.*?IEnumerable<([^>]+)>.*/, '$1') + '>();';
            else if (returnType !== '') ret = 'return null;';
            
            addedMethods += `\n        public async Task${returnType ? '<' + returnType + '>' : ''} ${methodName}(${parameters}) { ${ret} }`;
        }
    });
    
    if (addedMethods) {
        if (!rContent.includes('using System.Collections.Generic;')) {
            rContent = 'using System.Collections.Generic;\n' + rContent;
        }
        if (!rContent.includes('using RestaurantMS.Domain.Enums;')) {
            rContent = 'using RestaurantMS.Domain.Enums;\n' + rContent;
        }
        if (!rContent.includes('using RestaurantMS.Application.DTOs;')) {
            rContent = 'using RestaurantMS.Application.DTOs;\n' + rContent;
        }
        
        const isFileScoped = rContent.match(/namespace\s+[^;]+;/);
        
        const lastBraceIndex = rContent.lastIndexOf('}');
        if (lastBraceIndex === -1) return;

        if (isFileScoped) {
            // Insert before the last brace (which closes the class)
            rContent = rContent.substring(0, lastBraceIndex) + addedMethods + '\n    }\n';
        } else {
            // Find the second-to-last brace (which closes the class)
            const secondToLastBraceIndex = rContent.lastIndexOf('}', lastBraceIndex - 1);
            if (secondToLastBraceIndex !== -1) {
                rContent = rContent.substring(0, secondToLastBraceIndex) + addedMethods + '\n    }\n' + rContent.substring(secondToLastBraceIndex + 1);
            }
        }
        
        fs.writeFileSync(repoPath, rContent);
    }
});
