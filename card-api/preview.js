/**
 * Local preview generator — writes all SVG cards to /preview/ folder
 * Run: node preview.js
 * Then open preview/index.html in your browser
 */

const fs = require('fs');
const path = require('path');
const cardHandler = require('./api/card');

// Mock request/response to capture SVG output
function generateSVG(slug, width = 800) {
  return new Promise((resolve) => {
    const chunks = [];
    const mockReq = {
      url: slug ? `/api/card?project=${slug}&width=${width}` : `/api/card?width=${width}`,
      headers: { host: 'localhost:3000' }
    };
    const mockRes = {
      statusCode: 200,
      setHeader: () => {},
      end: (data) => resolve(data)
    };
    cardHandler(mockReq, mockRes);
  });
}

async function main() {
  const projects = require('./projects.json');
  const outDir = path.join(__dirname, 'preview');
  fs.mkdirSync(outDir, { recursive: true });

  // Generate individual cards
  for (const p of projects) {
    const svg = await generateSVG(p.slug);
    fs.writeFileSync(path.join(outDir, `${p.slug}.svg`), svg);
    console.log(`✅ Generated: ${p.slug}.svg`);
  }

  // Generate HTML preview page
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Card Preview — shlokkokk</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; font-family: 'Segoe UI', sans-serif; padding: 40px 20px; }
  h1 { color: #00ff88; font-family: monospace; margin-bottom: 8px; }
  .subtitle { color: #4b5563; font-size: 13px; margin-bottom: 40px; font-family: monospace; }
  .section-title { color: #9ca3af; font-family: monospace; font-size: 12px; letter-spacing: 3px; margin: 32px 0 16px; border-bottom: 1px solid #1e1e24; padding-bottom: 8px; }
  .card-stack { display: flex; flex-direction: column; gap: 12px; max-width: 820px; margin: 0 auto; }
  .card-wrap { cursor: pointer; transition: opacity 0.2s; }
  .card-wrap:hover { opacity: 0.9; }
  .card-wrap img { width: 100%; display: block; border-radius: 12px; }
</style>
</head>
<body>
<div style="max-width: 820px; margin: 0 auto;">
  <h1>$ ls -la project_cards/</h1>
  <div class="subtitle">local preview — ${projects.length} cards generated</div>

  <div class="section-title">★ FEATURED PROJECTS</div>
  <div class="card-stack">
    ${featured.map(p => `<div class="card-wrap"><img src="${p.slug}.svg" alt="${p.name}" /></div>`).join('\n    ')}
  </div>

  <div class="section-title">◆ ALL PROJECTS</div>
  <div class="card-stack">
    ${rest.map(p => `<div class="card-wrap"><img src="${p.slug}.svg" alt="${p.name}" /></div>`).join('\n    ')}
  </div>
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('\n🎉 Preview generated! Open: preview/index.html');
}

main().catch(console.error);
