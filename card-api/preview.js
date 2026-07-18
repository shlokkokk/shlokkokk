/**
 * Local preview generator — writes all SVG cards to /preview/ folder
 * Run: node preview.js
 * Then open preview/index.html in your browser
 */

const fs = require('fs');
const path = require('path');
const cardHandler = require('./api/card');

// Mock request/response to capture SVG output
function generateSVG(slug, type = 'card', width = 800) {
  return new Promise((resolve) => {
    const mockReq = {
      url: `/api/card?project=${slug}&type=${type}&width=${width}`,
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

  // Generate individual cards and buttons
  for (const p of projects) {
    const cardSvg = await generateSVG(p.slug, 'card');
    fs.writeFileSync(path.join(outDir, `${p.slug}.svg`), cardSvg);

    const codeSvg = await generateSVG(p.slug, 'code');
    fs.writeFileSync(path.join(outDir, `${p.slug}-code.svg`), codeSvg);

    if (p.liveUrl) {
      const demoSvg = await generateSVG(p.slug, 'demo');
      fs.writeFileSync(path.join(outDir, `${p.slug}-demo.svg`), demoSvg);
    }
    console.log(`✅ Generated: ${p.slug} card & buttons`);
  }

  // Generate HTML preview page
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  const getProjectBlock = (p) => `
    <div class="project-block">
      <div class="card-wrap"><img src="${p.slug}.svg" alt="${p.name}" /></div>
      <div class="buttons-wrap">
        <a href="https://github.com/${p.repo}" target="_blank">
          <img src="${p.slug}-code.svg" alt="Code" />
        </a>
        ${p.liveUrl ? `
        <a href="${p.liveUrl}" target="_blank">
          <img src="${p.slug}-demo.svg" alt="Demo" />
        </a>
        ` : ''}
      </div>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Premium Card Preview — shlokkokk</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #07080b; font-family: 'Segoe UI', sans-serif; padding: 60px 20px; }
  h1 { color: #00ff88; font-family: monospace; margin-bottom: 8px; font-size: 26px; }
  .subtitle { color: #475569; font-size: 13px; margin-bottom: 50px; font-family: monospace; }
  .section-title { color: #64748b; font-family: monospace; font-size: 11px; letter-spacing: 3px; margin: 40px 0 20px; border-bottom: 1.5px solid #1e293b; padding-bottom: 8px; text-transform: uppercase; }
  .card-stack { display: flex; flex-direction: column; gap: 24px; max-width: 820px; margin: 0 auto; }
  .project-block { display: flex; flex-direction: column; gap: 10px; background: #0b0c10; padding: 10px; border-radius: 16px; border: 1.5px solid #1e293b; }
  .card-wrap img { width: 100%; display: block; border-radius: 12px; }
  .buttons-wrap { display: flex; gap: 10px; padding-left: 20px; margin-top: 2px; }
  .buttons-wrap img { height: 26px; cursor: pointer; transition: opacity 0.2s, transform 0.2s; }
  .buttons-wrap img:hover { opacity: 0.85; transform: translateY(-1px); }
</style>
</head>
<body>
<div style="max-width: 820px; margin: 0 auto;">
  <h1>$ ls -la project_cards/ --stunning</h1>
  <div class="subtitle">cyber aesthetic preview — ${projects.length} modules loaded</div>

  <div class="section-title">★ FEATURED MODULES</div>
  <div class="card-stack">
    ${featured.map(getProjectBlock).join('')}
  </div>

  <div class="section-title">◆ ACTIVE ARCHIVES</div>
  <div class="card-stack">
    ${rest.map(getProjectBlock).join('')}
  </div>
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('\n🎉 Stunning preview generated! Open: preview/index.html');
}

main().catch(console.error);
