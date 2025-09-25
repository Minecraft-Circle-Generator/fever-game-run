const fs = require('fs');
const path = require('path');

const domain = process.env.DEPLOY_DOMAIN || 'https://fever-game-run.vercel.app';
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

function isoDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function updateSitemap() {
  let xml;
  try {
    xml = fs.readFileSync(sitemapPath, 'utf8');
  } catch (e) {
    // 若不存在则生成基础结构
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${isoDate()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  }

  // 替换 loc 域名与 lastmod
  xml = xml
    .replace(/<loc>.*?<\/loc>/g, `<loc>${domain}/</loc>`)
    .replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${isoDate()}</lastmod>`);

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Updated sitemap.xml with domain=${domain} and lastmod=${isoDate()}`);
}

updateSitemap();