const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src/lib/backend/model');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
        
        // Find the model name from module.exports
        const exportMatch = content.match(/module\.exports = mongoose\.model\(['"](.*?)['"], (.*?)\);/);
        
        if (exportMatch) {
            const modelName = exportMatch[1];
            const schemaName = exportMatch[2];
            
            const newExport = `module.exports = mongoose.models.${modelName} || mongoose.model("${modelName}", ${schemaName});`;
            
            content = content.replace(exportMatch[0], newExport);
            
            fs.writeFileSync(path.join(modelsDir, file), content, 'utf8');
            console.log(`Refactored CJS ${file}`);
        }
    }
});
