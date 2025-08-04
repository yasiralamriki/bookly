import fs from 'fs';
import path from 'path';

function getConfigFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } else {
            // File doesn't exist, create it
            createEmptyConfigFile(filePath);
            return [];
        }
    } catch (error) {
        // If there's any error reading/parsing, create a new empty file
        createEmptyConfigFile(filePath);
        return [];
    }
}

function createEmptyConfigFile(filePath) {
    const config = [];
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

export {
    getConfigFile,
    createEmptyConfigFile
}