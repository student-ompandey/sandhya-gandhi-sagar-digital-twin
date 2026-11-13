#!/usr/bin/env node
/**
 * SANDHYA 2.1 Build Script
 * Inlines CSS, JS, and base64 textures into a single self-contained HTML file.
 * Usage: node build.js
 * Output: dist/sandhya.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Ensure dist/ exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// Read source files
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const texturesJs = fs.readFileSync(path.join(ROOT, 'assets', 'textures.js'), 'utf8');

// Build the single-file HTML
let output = html;

// 1. Replace the CSS <link> with an inline <style>
output = output.replace(
  /<link rel="stylesheet" href="css\/style\.css">/,
  `<style>\n${css}\n</style>`
);

// 2. Replace the textures.js <script> with inline <script>
output = output.replace(
  /<script src="assets\/textures\.js"><\/script>/,
  `<script>\n${texturesJs}\n</script>`
);

// 3. Replace the app.js <script> with inline <script>
output = output.replace(
  /<script src="js\/app\.js"><\/script>/,
  `<script>\n${appJs}\n</script>`
);

// Write output
const outPath = path.join(DIST, 'sandhya.html');
fs.writeFileSync(outPath, output, 'utf8');

const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`✅ Built: ${outPath} (${sizeKB} KB)`);

