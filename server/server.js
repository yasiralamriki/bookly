import express from "express";
import ViteExpress from "vite-express";
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

ViteExpress.config({ 
    mode: isProduction ? "production" : "development",
    viteConfigFile: resolve(__dirname, "../client/vite.config.ts"),
    inlineViteConfig: {
        root: resolve(__dirname, "../client"),
        build: {
            outDir: resolve(__dirname, "../client/dist")
        }
    }
});

app.get("/message", (_, res) => res.send("Hello from express!"));

// Add your API routes here
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

ViteExpress.listen(app, 5173, () => {
    console.log(`Server is listening on http://localhost:5173`);
    console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
});