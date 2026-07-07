const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src/models');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
        
        // Replace require mongoose
        content = content.replace(/const mongoose = require\(['"]mongoose['"]\);/g, 'import mongoose from "mongoose";');
        
        // Find the model name from module.exports
        const exportMatch = content.match(/module\.exports = mongoose\.model\(['"](.*?)['"], (.*?)\);/);
        
        if (exportMatch) {
            const modelName = exportMatch[1];
            const schemaName = exportMatch[2];
            
            const newExport = `const ${modelName} = mongoose.models.${modelName} || mongoose.model("${modelName}", ${schemaName});\nexport default ${modelName};`;
            
            content = content.replace(exportMatch[0], newExport);
            
            fs.writeFileSync(path.join(modelsDir, file), content, 'utf8');
            console.log(`Refactored ${file}`);
        }
    }
});
