const fs = require('fs');
const path = require('path');

const interfacesDir = 'RestaurantMS/src/RestaurantMS.Application/Interfaces';
const reposDir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

const interfaceFiles = fs.readdirSync(interfacesDir).filter(f => f.endsWith('Repository.cs'));

interfaceFiles.forEach(ifile => {
    const iContent = fs.readFileSync(path.join(interfacesDir, ifile), 'utf-8');
    const repoFile = ifile.substring(1); // ICategoryRepository.cs -> CategoryRepository.cs
    
    // Find methods in interface
    const methods = [...iContent.matchAll(/Task(?:<([^>]+)>)?\s+([A-Za-z0-9_]+)\s*\(([^)]*)\);/g)];
    
    const repoPath = path.join(reposDir, repoFile);
    if (!fs.existsSync(repoPath)) return;
    
    let rContent = fs.readFileSync(repoPath, 'utf-8');
    
    // Check missing methods and append them before the last closing brace
    let addedMethods = '';
    methods.forEach(m => {
        const returnType = m[1] || '';
        const methodName = m[2];
        const parameters = m[3];
        
        if (!rContent.includes(' ' + methodName + '(')) {
            // Need to implement
            let ret = '';
            if (returnType === 'long' || returnType === 'int') ret = 'return 0;';
            else if (returnType === 'bool') ret = 'return false;';
            else if (returnType.includes('IEnumerable')) ret = 'return new List<' + returnType.replace(/IEnumerable<([^>]+)>/, '$1') + '>();';
            else if (returnType !== '') ret = 'return null;';
            
            // Fix async issue
            const signature = `        public async Task${returnType ? '<' + returnType + '>' : ''} ${methodName}(${parameters}) { ${ret} }\n`;
            addedMethods += signature;
        }
    });
    
    if (addedMethods) {
        // add using statements
        if (!rContent.includes('using System.Collections.Generic;')) {
            rContent = 'using System.Collections.Generic;\n' + rContent;
        }
        
        rContent = rContent.replace(/}\s*$/, `\n${addedMethods}}`);
        fs.writeFileSync(repoPath, rContent);
    }
});
