const fs = require('fs');
const path = require('path');

const reposDir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';
const repoFiles = fs.readdirSync(reposDir).filter(f => f.endsWith('Repository.cs'));

repoFiles.forEach(repoFile => {
    const repoPath = path.join(reposDir, repoFile);
    let rContent = fs.readFileSync(repoPath, 'utf-8');
    
    // if the end of the file is }\n}, change it to just }
    if (rContent.trim().endsWith('}\n}')) {
        const isFileScoped = rContent.match(/namespace\s+[^;]+;/);
        if (isFileScoped) {
            rContent = rContent.substring(0, rContent.lastIndexOf('}'));
            fs.writeFileSync(repoPath, rContent);
        }
    }
});
