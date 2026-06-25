import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buyerScenarios, faqs, markets, nav, products, site, solutions } from "./site-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "dist");
const routes = [];

function emptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyAssets() {
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.copyFileSync(path.join(__dirname, "styles.css"), path.join(outDir, "assets", "styles.css"));
  fs.copyFileSync(path.join(__dirname, "main.js"), path.join(outDir, "assets", "main.js"));
  fs.copyFileSync(path.join(rootDir, "assets", "favicon.svg"), path.join(outDir, "assets", "favicon.svg"));
  fs.cpSync(path.join(rootDir, "assets", "images"), path.join(outDir, "assets", "images"), {
    recursive: true
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toRoot(filePath) {
  const rel = path.relative(path.dirname(filePath), outDir).replaceAll(path.sep, "/");
  return rel === "" || rel === "." ? "" : `${rel}/`;
}

function pageUrl(filePath) {
  const rel = path.relative(outDir, filePath).replaceAll(path.sep, "/");
  if (rel === "index.html") return "";
  return rel.replace(/index\.html$/, "");
}

function slugToProduct(slug) {
  return products.find((product) => product.slug === slug);
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function header(root) {
  const homeHref = root || "./";
  const links = nav
    .map(([label, href]) => `<a href="${root}${href}">${escapeHtml(label)}</a>`)
    .join("");

  return `
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="${homeHref}" aria-label="${site.name} home">
          <span class="brand-mark">Q</span>
          <span>${site.brand}</span>
        </a>
        <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-button>☰</button>
        <nav class="nav-links" data-nav>${links}</nav>
      </div>
    </header>`;
}

function footer(root) {
  const homeHref = root || "./";
  const productLinks = products
    .slice(0, 5)
    .map((item) => `<a href="${root}products/${item.slug}/">${escapeHtml(item.name)}</a>`)
    .join("");
  const solutionLinks = solutions
    .slice(0, 4)
    .map((item) => `<a href="${root}solutions/${item.slug}/">${escapeHtml(item.name)}</a>`)
    .join("");

  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <a class="brand" href="${homeHref}" aria-label="${site.name} home">
            <span class="brand-mark">Q</span>
            <span>${site.brand}</span>
          </a>
          <p style="max-width:520px;margin-top:18px">${escapeHtml(site.description)}</p>
          <a class="button secondary" href="${root}contact/">Send RFQ</a>
        </div>
        <div class="footer-links">
          <div>
            <h3>Products</h3>
            ${productLinks}
          </div>
          <div>
            <h3>Solutions</h3>
            ${solutionLinks}
          </div>
          <div>
            <h3>Contact</h3>
            <p>${escapeHtml(site.email)}</p>
            <p>${escapeHtml(site.whatsapp)}</p>
            <p>${escapeHtml(site.address)}</p>
          </div>
        </div>
      </div>
      <div class="copyright">
        <div class="section-inner">© <span data-year></span> ${site.name}. Built for overseas plastic recycling and extrusion buyers.</div>
      </div>
    </footer>`;
}

function layout({ filePath, title, description, body, schema = [] }) {
  const root = toRoot(filePath);
  const cleanUrl = `${site.url}/${pageUrl(filePath)}`.replace(/\/$/, "/");
  const schemaMarkup = schema.map(jsonLd).join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${cleanUrl}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${site.url}/${site.heroImage}">
    <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${root}assets/styles.css">
    ${schemaMarkup}
  </head>
  <body>
    ${header(root)}
    <main>
      ${body}
    </main>
    ${footer(root)}
    <script src="${root}assets/main.js" defer></script>
  </body>
</html>`;
}

function writePage(relPath, page) {
  const filePath = path.join(outDir, relPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, layout({ ...page, filePath }));
  routes.push(filePath);
}

function pageHero(title, description, eyebrow = "Qunke", homePrefix = "../") {
  return `
    <section class="page-hero">
      <div class="section-inner">
        <div class="breadcrumb"><a href="${homePrefix}">Home</a> / ${escapeHtml(eyebrow)}</div>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="page-lede">${escapeHtml(description)}</p>
      </div>
    </section>`;
}

function productCard(product, root = "") {
  return `
    <article class="card">
      <span class="kicker">${escapeHtml(product.kicker)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p>
      <a class="link" href="${root}products/${product.slug}/">View machine -></a>
    </article>`;
}

function solutionCard(solution, root = "") {
  return `
    <article class="card">
      <span class="kicker">Solution</span>
      <h3>${escapeHtml(solution.name)}</h3>
      <p>${escapeHtml(solution.description)}</p>
      <a class="link" href="${root}solutions/${solution.slug}/">Explore solution -></a>
    </article>`;
}

function list(items) {
  return `<ul class="list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function faqBlock() {
  return `
    <div class="grid two">
      ${faqs
        .map(
          ([question, answer]) => `
        <article class="card">
          <h3>${escapeHtml(question)}</h3>
          <p>${escapeHtml(answer)}</p>
        </article>`
        )
        .join("")}
    </div>`;
}

function homePage() {
  const body = `
    <section class="hero">
      <img src="${site.heroImage}" alt="Qunke plastic recycling and extrusion machinery production line">
      <div class="hero-content">
        <p class="eyebrow">Plastic recycling and extrusion machinery</p>
        <h1>Qunke Plastic Recycling & Extrusion Machinery</h1>
        <p class="hero-lede">Washing, crushing, pelletizing and pipe extrusion lines for overseas buyers who need practical machine configuration, factory testing and clear technical communication.</p>
        <div class="cta-row">
          <a class="button primary" href="contact/">Request a Quote</a>
          <a class="button secondary" href="products/">View Products</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="section-head">
          <h2>Core machinery for recycling and extrusion projects.</h2>
          <p>Build your first quotation around material type, contamination level, factory space and final product target.</p>
        </div>
        <div class="grid products">${products.slice(0, 8).map((product) => productCard(product)).join("")}</div>
      </div>
    </section>

    <section class="section tint">
      <div class="section-inner">
        <div class="stats-band">
          <div class="stat"><strong>PET</strong><span>Bottle washing and flake preparation</span></div>
          <div class="stat"><strong>PP PE</strong><span>Film washing and pelletizing</span></div>
          <div class="stat"><strong>PVC</strong><span>Pipe extrusion line planning</span></div>
          <div class="stat"><strong>HDPE</strong><span>Pipe and rigid plastic processing</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="section-head">
          <h2>Buyer scenarios Qunke is built around.</h2>
          <p>Overseas buyers often start with incomplete material information. Qunke pages are organized to help turn that early inquiry into a workable machine proposal.</p>
        </div>
        <div class="grid three">
          ${buyerScenarios
            .map(
              (item) => `
              <article class="card">
                <span class="kicker">Buyer fit</span>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.text)}</p>
              </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section tint">
      <div class="section-inner">
        <div class="section-head">
          <h2>Solutions by material and final output.</h2>
          <p>Each solution connects the material problem with the right washing, drying, pelletizing or extrusion route.</p>
        </div>
        <div class="grid two">${solutions.map((solution) => solutionCard(solution)).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="content-split">
          <div>
            <p class="eyebrow">RFQ workflow</p>
            <h2>Start with material evidence, not a generic machine list.</h2>
            <p class="page-lede">A useful quotation begins with your material photo or video, capacity target, local voltage, factory space and final product requirement.</p>
          </div>
          <div class="panel">
            <h3>Send first</h3>
            ${list(["Material type and contamination level", "Target output per hour or per day", "Final product: flakes, pellets or pipe", "Workshop size and voltage", "Destination country and port"])}
            <a class="button primary" style="margin-top:20px" href="contact/">Send RFQ</a>
          </div>
        </div>
      </div>
    </section>`;

  writePage("index.html", {
    title: "Qunke Plastic Recycling & Extrusion Machinery",
    description: site.description,
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: site.url,
        email: site.email
      }
    ]
  });
}

function productsIndex() {
  const body = `
    ${pageHero("Plastic Recycling and Extrusion Machinery", "Explore Qunke machinery for washing, crushing, pelletizing and pipe extrusion projects.", "Products")}
    <section class="section">
      <div class="section-inner">
        <div class="grid products">${products.map((product) => productCard(product, "../")).join("")}</div>
      </div>
    </section>`;

  writePage("products/index.html", {
    title: "Products | Qunke Plastic Machinery",
    description: "Plastic recycling, washing, pelletizing, crusher and extrusion machinery from Qunke.",
    body
  });
}

function productPages() {
  products.forEach((product) => {
    const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
    const body = `
      ${pageHero(product.title, product.description, "Products", "../../")}
      <section class="section">
        <div class="section-inner content-split">
          <article>
            <div class="panel">
              <h2>Machine Application</h2>
              <p>${escapeHtml(product.buyerFit)}</p>
            </div>
            <div class="panel" style="margin-top:18px">
              <h2>Typical Process Flow</h2>
              <div class="process">${product.process.map((step) => `<div class="step">${escapeHtml(step)}</div>`).join("")}</div>
            </div>
            <div class="panel" style="margin-top:18px">
              <h2>RFQ Notes</h2>
              <p>Qunke should confirm the final configuration after checking your material condition, target output, factory layout and local electrical standard.</p>
            </div>
          </article>
          <aside>
            <div class="panel">
              <h3>Suitable Materials</h3>
              ${list(product.materials)}
            </div>
            <div class="panel" style="margin-top:18px">
              <h3>Next Step</h3>
              <p>${escapeHtml(product.cta)}</p>
              <a class="button primary" href="../../contact/">Request quote</a>
            </div>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Related machinery</h2>
            <p>Compare the supporting machines that may be part of the same production line.</p>
          </div>
          <div class="grid three">${related.map((item) => productCard(item, "../../")).join("")}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-inner">
          <div class="section-head">
            <h2>FAQ</h2>
            <p>Common questions before an overseas machinery quotation.</p>
          </div>
          ${faqBlock()}
        </div>
      </section>`;

    writePage(`products/${product.slug}/index.html`, {
      title: `${product.title} | Qunke`,
      description: product.description,
      body,
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          brand: site.brand,
          description: product.description
        }
      ]
    });
  });
}

function solutionsIndex() {
  const body = `
    ${pageHero("Plastic Recycling Solutions by Material", "Choose a process route around PET bottles, PP PE film, agricultural film or turnkey recycling plant planning.", "Solutions")}
    <section class="section">
      <div class="section-inner">
        <div class="grid two">${solutions.map((solution) => solutionCard(solution, "../")).join("")}</div>
      </div>
    </section>`;

  writePage("solutions/index.html", {
    title: "Solutions | Qunke Plastic Machinery",
    description: "Plastic recycling solution pages for PET bottle recycling, PP PE film recycling and turnkey recycling plants.",
    body
  });
}

function solutionPages() {
  solutions.forEach((solution) => {
    const machines = solution.links.map(slugToProduct).filter(Boolean);
    const body = `
      ${pageHero(solution.title, solution.description, "Solutions", "../../")}
      <section class="section">
        <div class="section-inner content-split">
          <div>
            <div class="panel">
              <h2>Workflow</h2>
              <div class="process">${solution.steps.map((step) => `<div class="step">${escapeHtml(step)}</div>`).join("")}</div>
            </div>
          </div>
          <aside>
            <div class="panel">
              <h3>Useful for buyers who need</h3>
              ${list(["Material-specific line planning", "Machine configuration before quotation", "Factory testing before shipment", "Clear spare parts and installation planning"])}
              <a class="button primary" style="margin-top:20px" href="../../contact/">Send project details</a>
            </div>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Recommended machines</h2>
            <p>These machines usually appear in this type of project.</p>
          </div>
          <div class="grid three">${machines.map((product) => productCard(product, "../../")).join("")}</div>
        </div>
      </section>`;

    writePage(`solutions/${solution.slug}/index.html`, {
      title: `${solution.title} | Qunke`,
      description: solution.description,
      body
    });
  });
}

function marketPages() {
  markets.forEach((market) => {
    const body = `
      ${pageHero(market.title, market.description, "Markets", "../../")}
      <section class="section">
        <div class="section-inner content-split">
          <div class="panel">
            <h2>Market Notes</h2>
            ${list(market.points)}
          </div>
          <aside class="panel">
            <h3>Send before quotation</h3>
            ${list(["Material photos or videos", "Target output", "Workshop location and voltage", "Final product requirement", "Destination port"])}
            <a class="button primary" style="margin-top:20px" href="../../contact/">Contact Qunke</a>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Machines often requested by ${escapeHtml(market.name)} buyers</h2>
            <p>Start with a material-specific machine page, then send your project detail for configuration.</p>
          </div>
          <div class="grid three">${products.slice(0, 6).map((product) => productCard(product, "../../")).join("")}</div>
        </div>
      </section>`;

    writePage(`markets/${market.slug}/index.html`, {
      title: `${market.title} | Qunke`,
      description: market.description,
      body
    });
  });
}

function supportingPages() {
  writePage("videos/index.html", {
    title: "Factory Videos and Machine Testing | Qunke",
    description: "Qunke machine testing and factory video page for overseas plastic machinery buyers.",
    body: `
      ${pageHero("Factory Videos and Machine Testing", "Add YouTube videos here for machine running tests, factory acceptance tests, loading and product output inspection.", "Videos")}
      <section class="section">
        <div class="section-inner grid three">
          <div class="video-box">PET bottle washing line video</div>
          <div class="video-box">PP PE film pelletizing video</div>
          <div class="video-box">Pipe extrusion line video</div>
        </div>
      </section>`
  });

  writePage("about/index.html", {
    title: "About Qunke | Plastic Machinery Manufacturer",
    description: "About Qunke plastic recycling and extrusion machinery manufacturing for overseas buyers.",
    body: `
      ${pageHero("About Qunke", "Qunke is positioned as a China-based plastic machinery brand focused on practical recycling and extrusion line configuration for overseas buyers.", "About")}
      <section class="section">
        <div class="section-inner content-split">
          <div>
            <h2>Built around real materials and clear communication.</h2>
            <p class="page-lede">The website is structured for buyers who need to compare machine routes before investing in PET washing, film washing, pelletizing, crushing or pipe extrusion equipment.</p>
          </div>
          <aside class="panel">
            <h3>What to verify before launch</h3>
            ${list(["Factory photos", "Actual address", "Business license details", "Machine test videos", "Export case references", "Service process"])}
          </aside>
        </div>
      </section>`
  });

  writePage("case-studies/index.html", {
    title: "Application Examples | Qunke Plastic Machinery",
    description: "Application examples for Qunke plastic recycling machinery buyers by material, output and factory situation.",
    body: `
      ${pageHero("Application Examples", "Use this section for verified customer projects after adding real countries, materials, machine configurations and results.", "Case Studies")}
      <section class="section">
        <div class="section-inner grid three">
          ${buyerScenarios
            .map(
              (item) => `
              <article class="card">
                <span class="kicker">Application</span>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.text)}</p>
              </article>`
            )
            .join("")}
        </div>
      </section>`
  });

  writePage("blog/index.html", {
    title: "Plastic Machinery Buying Guides | Qunke",
    description: "Buying guides for overseas plastic recycling and extrusion machinery buyers.",
    body: `
      ${pageHero("Plastic Machinery Buying Guides", "Technical and commercial notes for overseas buyers comparing recycling and extrusion machinery.", "Guides")}
      <section class="section">
        <div class="section-inner grid two">
          <article class="card">
            <span class="kicker">Price guide</span>
            <h3>Plastic Recycling Machine Price Guide</h3>
            <p>Understand the main factors that change quotation scope, including material contamination, capacity, washing stages, drying target and pelletizing route.</p>
            <a class="link" href="plastic-recycling-machine-price-guide/">Read guide -></a>
          </article>
        </div>
      </section>`
  });

  writePage("blog/plastic-recycling-machine-price-guide/index.html", {
    title: "Plastic Recycling Machine Price Guide | Qunke",
    description: "A practical price guide for overseas buyers comparing plastic recycling machine quotations.",
    body: `
      ${pageHero("Plastic Recycling Machine Price Guide", "A reliable quotation depends on material condition, output target, final product and line scope.", "Guide", "../../")}
      <section class="section">
        <div class="section-inner content-split">
          <article class="panel">
            <h2>What changes the price?</h2>
            ${list(["Material type and contamination level", "Target output and operation hours", "Washing stages and drying target", "Single machine or complete line scope", "Electrical standard and control configuration", "Testing, packing, shipment and installation support"])}
            <p style="margin-top:18px">Avoid comparing only the machine name. A PET bottle washing line and a film washing line can have very different layouts, water usage, drying systems and final product targets.</p>
          </article>
          <aside class="panel">
            <h3>Get a better quote</h3>
            <p>Send your material photo, expected capacity and final product requirement before asking for price.</p>
            <a class="button primary" href="../../contact/">Send RFQ</a>
          </aside>
        </div>
      </section>`
  });
}

function contactPage() {
  const body = `
    ${pageHero("Contact Qunke", "Send your material information, target output and country to start a practical machine proposal.", "Contact")}
    <section class="section">
      <div class="section-inner content-split">
        <form class="panel form" action="mailto:${site.email}" method="post" enctype="text/plain">
          <label>Name<input name="name" autocomplete="name" required></label>
          <label>Country<input name="country" autocomplete="country-name" required></label>
          <label>Material
            <select name="material">
              <option>PET bottles</option>
              <option>PP PE film</option>
              <option>Plastic scrap</option>
              <option>PVC pipe</option>
              <option>HDPE pipe</option>
            </select>
          </label>
          <label>Capacity target<input name="capacity" placeholder="Example: kg/h or tons/day"></label>
          <label>Email or WhatsApp<input name="contact" required></label>
          <label>Project details<textarea name="message" placeholder="Material condition, final product, factory space, voltage and destination port"></textarea></label>
          <button class="button primary" type="submit">Send RFQ</button>
        </form>
        <aside class="panel">
          <h2>Contact details</h2>
          ${list([`Email: ${site.email}`, `WhatsApp: ${site.whatsapp}`, `Address: ${site.address}`])}
          <h3 style="margin-top:26px">Useful attachments</h3>
          ${list(["Material photos", "Material running video", "Factory layout", "Target final product photo", "Current machine list if upgrading"])}
        </aside>
      </div>
    </section>`;

  writePage("contact/index.html", {
    title: "Contact Qunke | Request Plastic Machinery Quote",
    description: "Contact Qunke to request a quotation for plastic recycling, washing, pelletizing, crushing or pipe extrusion machinery.",
    body
  });
}

function writeSupportFiles() {
  const sitemap = routes
    .map((filePath) => {
      const loc = `${site.url}/${pageUrl(filePath)}`.replace(/\/$/, "/");
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(outDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`
  );

  fs.writeFileSync(
    path.join(outDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`
  );

  fs.writeFileSync(
    path.join(outDir, "_headers"),
    `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`
  );
}

emptyDir(outDir);
copyAssets();
homePage();
productsIndex();
productPages();
solutionsIndex();
solutionPages();
marketPages();
supportingPages();
contactPage();
writeSupportFiles();

console.log(`Built ${routes.length} pages to ${path.relative(rootDir, outDir)}`);
