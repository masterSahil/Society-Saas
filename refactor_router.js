const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            // Replace react-router-dom imports
            if (content.includes('react-router-dom')) {
                content = content.replace(/['"]react-router-dom['"]/g, "'@/lib/react-router-dom'");
                updated = true;
            }
            
            // App Router components need "use client" if they use hooks
            if (updated && !content.includes('"use client"')) {
                content = '"use client";\n' + content;
            }
            
            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Refactored ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Router refactoring complete.');
