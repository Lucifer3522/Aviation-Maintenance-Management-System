// Get Required Libraries
import express from 'express';
import fs from 'fs';
import path  from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Get Local Libraries
import logger from '../utils/logger.js';

// Router
const router = express.Router();

// Local Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Router Controller
async function routerController( dir ) {
    const files = fs.readdirSync(dir);

    for(const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if(stat.isDirectory()) {
            await routerController(fullPath);
        } else if(file.endsWith('-routes.js') && file !== 'router.js') {
            const routeModule = await import(pathToFileURL(fullPath).href);
            const route = routeModule.default;

            if (route) {
                logger.dropInfo('ROUTER', path.relative(__dirname, fullPath), 'Active');
                router.use(route);
            }
        }
    }
}

// Load Router Function
await routerController(__dirname);

// Export Local Router
export default router;