import fs from 'fs';

function getConfigFile(path) {
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } else {
        throw new Error(`Configuration file not found at ${path}`);
    }
}

export {
    getConfigFile
}