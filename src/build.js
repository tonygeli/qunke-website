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
            <h3>Machines</h3>
            ${productLinks}
          </div>
          <div>
            <h3>Applications</h3>
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
        <div class="section-inner">© <span data-year></span> ${site.name}. Built for overseas PP woven bag machinery buyers and China suppliers.</div>
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
      <a class="link" href="${root}products/${product.slug}/">Compare suppliers -></a>
    </article>`;
}

function solutionCard(solution, root = "") {
  return `
    <article class="card">
      <span class="kicker">Solution</span>
      <h3>${escapeHtml(solution.name)}</h3>
      <p>${escapeHtml(solution.description)}</p>
      <a class="link" href="${root}solutions/${solution.slug}/">View application -></a>
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
      <img src="${site.heroImage}" alt="Qunke PP woven bag machinery supplier matching platform">
      <div class="hero-content">
        <p class="eyebrow">PP woven bag machinery supplier finder</p>
        <h1>Compare China PP Woven Bag Machine Suppliers</h1>
        <p class="hero-lede">Submit one RFQ for tape extrusion lines, circular looms, laminating, printing, cutting and sewing, valve bag and FIBC machinery from China suppliers.</p>
        <div class="cta-row">
          <a class="button primary" href="contact/">Post Your RFQ</a>
          <a class="button secondary" href="for-suppliers/">For Suppliers</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="section-head">
          <h2>Machine categories for woven sack factories.</h2>
          <p>Start with the equipment category, final bag type and output target, then compare relevant China suppliers.</p>
        </div>
        <div class="grid products">${products.slice(0, 8).map((product) => productCard(product)).join("")}</div>
      </div>
    </section>

    <section class="section tint">
      <div class="section-inner">
        <div class="stats-band">
          <div class="stat"><strong>RFQ</strong><span>Buyer requirements organized by machine type</span></div>
          <div class="stat"><strong>PP</strong><span>Woven bag, sack and tape production</span></div>
          <div class="stat"><strong>BOPP</strong><span>Laminated packaging bag projects</span></div>
          <div class="stat"><strong>FIBC</strong><span>Jumbo bag and industrial packaging lines</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="section-head">
          <h2>Buyer scenarios Qunke is built around.</h2>
          <p>Overseas buyers can submit a simple RFQ first. Relevant China suppliers handle the detailed machine configuration and quotation.</p>
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
          <h2>Applications by final bag product.</h2>
          <p>Each application page translates the final packaging product into likely machine categories and supplier matching notes.</p>
        </div>
        <div class="grid two">${solutions.map((solution) => solutionCard(solution)).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-inner">
        <div class="content-split">
          <div>
            <p class="eyebrow">RFQ workflow</p>
            <h2>Post one RFQ, then compare supplier responses.</h2>
            <p class="page-lede">You do not need to write a perfect technical specification. Start with bag type, size, target output, country and contact details.</p>
          </div>
          <div class="panel">
            <h3>Send first</h3>
            ${list(["Bag type and sample photo", "Machine category or complete line request", "Bag width, length and fabric GSM if known", "Target output and destination country", "Email or WhatsApp for supplier replies"])}
            <a class="button primary" style="margin-top:20px" href="contact/">Post RFQ</a>
          </div>
        </div>
      </div>
    </section>`;

  writePage("index.html", {
    title: "Qunke PP Woven Bag Machinery Supplier Finder",
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
    ${pageHero("PP Woven Bag Machinery Categories", "Compare China suppliers for PP tape extrusion, circular loom, laminating, printing, cutting sewing, cement valve bag and FIBC machinery.", "Machines")}
    <section class="section">
      <div class="section-inner">
        <div class="grid products">${products.map((product) => productCard(product, "../")).join("")}</div>
      </div>
    </section>`;

  writePage("products/index.html", {
    title: "PP Woven Bag Machinery Categories | Qunke",
    description: "Supplier matching pages for PP woven bag, circular loom, tape extrusion, laminating, printing and bag conversion machinery.",
    body
  });
}

function productPages() {
  products.forEach((product) => {
    const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
    const body = `
      ${pageHero(product.title, product.description, "Machines", "../../")}
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
              <p>Qunke is a supplier matching platform. Submit one clear RFQ, then let relevant China suppliers confirm technical configuration, price, delivery terms and testing support.</p>
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
              <a class="button primary" href="../../contact/">Post RFQ</a>
            </div>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Related machinery</h2>
            <p>These machine categories often appear in the same woven bag or sack production project.</p>
          </div>
          <div class="grid three">${related.map((item) => productCard(item, "../../")).join("")}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-inner">
          <div class="section-head">
            <h2>FAQ</h2>
            <p>Common questions before submitting a woven bag machinery RFQ.</p>
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
          "@type": "Service",
          name: product.name,
          provider: {
            "@type": "Organization",
            name: site.name,
            url: site.url
          },
          serviceType: `${product.name} supplier matching`,
          description: product.description
        }
      ]
    });
  });
}

function solutionsIndex() {
  const body = `
    ${pageHero("Woven Bag Applications", "Choose an application around PP woven bags, cement sacks, BOPP laminated bags or FIBC jumbo bag production.", "Applications")}
    <section class="section">
      <div class="section-inner">
        <div class="grid two">${solutions.map((solution) => solutionCard(solution, "../")).join("")}</div>
      </div>
    </section>`;

  writePage("solutions/index.html", {
    title: "Woven Bag Applications | Qunke",
    description: "Application pages for PP woven bag, cement bag, BOPP laminated bag and FIBC jumbo bag machinery sourcing.",
    body
  });
}

function solutionPages() {
  solutions.forEach((solution) => {
    const machines = solution.links.map(slugToProduct).filter(Boolean);
    const body = `
      ${pageHero(solution.title, solution.description, "Applications", "../../")}
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
              ${list(["Supplier matching by final bag type", "Comparable quotes from relevant factories", "Machine test video requirements", "Clear spare parts and installation terms"])}
              <a class="button primary" style="margin-top:20px" href="../../contact/">Post application RFQ</a>
            </div>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Recommended machine categories</h2>
            <p>These machines usually appear in this type of woven bag project.</p>
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
            ${list(["Final bag photo or drawing", "Machine category or complete line request", "Bag size and output target", "Workshop location and voltage", "Destination port"])}
            <a class="button primary" style="margin-top:20px" href="../../contact/">Contact Qunke</a>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>Machines often requested by ${escapeHtml(market.name)} buyers</h2>
            <p>Start with a machine category, then submit one RFQ for relevant China suppliers to quote.</p>
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
    title: "Machine Videos and Supplier Testing | Qunke",
    description: "Video page for PP woven bag machinery testing, circular loom running, tape extrusion, bag conversion and supplier verification.",
    body: `
      ${pageHero("Machine Videos and Supplier Testing", "Use this page for circular loom running videos, tape extrusion testing, bag conversion lines, loading checks and supplier verification clips.", "Videos")}
      <section class="section">
        <div class="section-inner grid three">
          <div class="video-box">PP tape extrusion line video</div>
          <div class="video-box">Plastic circular loom video</div>
          <div class="video-box">Woven bag cutting sewing video</div>
        </div>
      </section>`
  });

  writePage("about/index.html", {
    title: "About Qunke | PP Woven Bag Machinery Supplier Finder",
    description: "About Qunke, a supplier matching platform for overseas buyers sourcing PP woven bag machinery from China.",
    body: `
      ${pageHero("About Qunke", "Qunke is positioned as a focused RFQ and supplier matching platform for PP woven bag, sack and plastic packaging machinery.", "About")}
      <section class="section">
        <div class="section-inner content-split">
          <div>
            <h2>Built for buyers who need supplier options, not a fake factory story.</h2>
            <p class="page-lede">Qunke helps overseas buyers submit RFQs for PP woven bag machinery and routes those requests to relevant China suppliers for quotation and follow-up.</p>
          </div>
          <aside class="panel">
            <h3>What to verify before launch</h3>
            ${list(["Supplier qualification process", "RFQ forwarding rules", "Privacy and buyer consent text", "Supplier response standards", "Machine category coverage", "Paid lead policy"])}
          </aside>
        </div>
      </section>`
  });

  writePage("case-studies/index.html", {
    title: "RFQ Examples | Qunke Woven Bag Machinery",
    description: "Example RFQ scenarios for PP woven bag machinery buyers by bag type, machine category and factory situation.",
    body: `
      ${pageHero("RFQ Examples", "Use this section for verified RFQ examples after adding real buyer countries, bag types, machine categories and supplier response outcomes.", "Case Studies")}
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
    title: "PP Woven Bag Machinery Buying Guides | Qunke",
    description: "Buying guides for overseas buyers comparing China suppliers for PP woven bag machinery.",
    body: `
      ${pageHero("PP Woven Bag Machinery Buying Guides", "Practical notes for buyers comparing tape extrusion, circular loom, laminating, printing and bag conversion suppliers.", "Guides")}
      <section class="section">
        <div class="section-inner grid two">
          <article class="card">
            <span class="kicker">RFQ guide</span>
            <h3>PP Woven Bag Machine RFQ Guide</h3>
            <p>Understand the information suppliers need before quoting, including bag type, size, fabric GSM, output, voltage and machine category.</p>
            <a class="link" href="pp-woven-bag-machine-rfq-guide/">Read guide -></a>
          </article>
        </div>
      </section>`
  });

  writePage("blog/pp-woven-bag-machine-rfq-guide/index.html", {
    title: "PP Woven Bag Machine RFQ Guide | Qunke",
    description: "A practical RFQ guide for overseas buyers comparing PP woven bag machine suppliers from China.",
    body: `
      ${pageHero("PP Woven Bag Machine RFQ Guide", "A useful supplier response depends on bag type, machine category, output target and clear contact information.", "Guide", "../../")}
      <section class="section">
        <div class="section-inner content-split">
          <article class="panel">
            <h2>What should be in your RFQ?</h2>
            ${list(["Final bag type: cement, rice, feed, fertilizer, BOPP laminated or FIBC", "Machine category: tape line, circular loom, laminating, printing or cutting sewing", "Bag width, length, fabric GSM and printing colors if known", "Target output per hour, day or month", "Local voltage, workshop space and destination port", "Supplier requirements: test video, spare parts, installation and warranty"])}
            <p style="margin-top:18px">Avoid sending only a machine name. A supplier needs the final bag specification to quote the right line configuration and auxiliary equipment.</p>
          </article>
          <aside class="panel">
            <h3>Get better supplier replies</h3>
            <p>Attach a bag sample photo or drawing and list the machine category you want to compare.</p>
            <a class="button primary" href="../../contact/">Post RFQ</a>
          </aside>
        </div>
      </section>`
  });

  writePage("for-suppliers/index.html", {
    title: "For China PP Woven Bag Machinery Suppliers | Qunke",
    description: "China suppliers can join Qunke to receive relevant overseas RFQs for PP woven bag, sack and plastic packaging machinery.",
    body: `
      ${pageHero("For China Suppliers", "Receive relevant overseas RFQs for PP woven bag, circular loom, tape extrusion, laminating, printing and bag conversion machinery.", "For Suppliers")}
      <section class="section">
        <div class="section-inner content-split">
          <div>
            <h2>Qunke is built to match focused RFQs with capable suppliers.</h2>
            <p class="page-lede">The early model is simple: buyers submit machine requirements, Qunke filters the RFQ, then suitable suppliers can respond with quotation and technical follow-up.</p>
          </div>
          <aside class="panel">
            <h3>Supplier categories</h3>
            ${list(["PP tape extrusion line manufacturers", "Circular loom and weaving machine suppliers", "Woven bag cutting sewing machine suppliers", "Laminating and printing machine suppliers", "Cement valve bag and FIBC equipment suppliers"])}
            <a class="button primary" style="margin-top:20px" href="../contact/">Apply as supplier</a>
          </aside>
        </div>
      </section>
      <section class="section tint">
        <div class="section-inner">
          <div class="section-head">
            <h2>How supplier cooperation can work.</h2>
            <p>Start with manual matching and pay-per-valid-RFQ. Membership and featured listings can be added after traffic is proven.</p>
          </div>
          <div class="grid three">
            <article class="card"><span class="kicker">Step 1</span><h3>Supplier profile</h3><p>Share machine categories, export markets, videos, certifications and response contacts.</p></article>
            <article class="card"><span class="kicker">Step 2</span><h3>RFQ matching</h3><p>Receive buyer requests that match your machine category and destination market capability.</p></article>
            <article class="card"><span class="kicker">Step 3</span><h3>Lead pricing</h3><p>Use pay-per-valid-RFQ first, then upgrade to category listing or featured supplier placement later.</p></article>
          </div>
        </div>
      </section>`
  });
}

function contactPage() {
  const body = `
    ${pageHero("Post Your RFQ", "Send your bag type, machine category, output target and country. Qunke can organize the request for China supplier matching.", "Post RFQ")}
    <section class="section">
      <div class="section-inner content-split">
        <form class="panel form" action="mailto:${site.email}" method="post" enctype="text/plain">
          <label>Name<input name="name" autocomplete="name" required></label>
          <label>Country<input name="country" autocomplete="country-name" required></label>
          <label>Machine category
            <select name="machine-category">
              <option>Complete PP woven bag production line</option>
              <option>PP tape extrusion line</option>
              <option>Plastic circular loom</option>
              <option>Woven bag cutting sewing machine</option>
              <option>BOPP / PP laminating machine</option>
              <option>Flexo printing machine</option>
              <option>Cement valve bag machine</option>
              <option>FIBC jumbo bag machine</option>
              <option>Auxiliary woven bag machines</option>
            </select>
          </label>
          <label>Bag type<input name="bag-type" placeholder="Example: cement bag, rice bag, feed bag, FIBC"></label>
          <label>Output target<input name="output" placeholder="Example: bags/day, rolls/day, looms quantity"></label>
          <label>Email or WhatsApp<input name="contact" required></label>
          <label>Project details<textarea name="message" placeholder="Bag size, fabric GSM, printing colors, voltage, factory space, destination port and supplier requirements"></textarea></label>
          <button class="button primary" type="submit">Post RFQ</button>
        </form>
        <aside class="panel">
          <h2>Contact details</h2>
          ${list([`Email: ${site.email}`, `WhatsApp: ${site.whatsapp}`, `Address: ${site.address}`])}
          <h3 style="margin-top:26px">Useful attachments</h3>
          ${list(["Final bag sample photo", "Bag drawing or size sheet", "Current machine list if upgrading", "Factory layout", "Target supplier response deadline"])}
        </aside>
      </div>
    </section>`;

  writePage("contact/index.html", {
    title: "Post RFQ | Qunke PP Woven Bag Machinery",
    description: "Submit an RFQ for PP woven bag, circular loom, tape extrusion, laminating, printing, valve bag or FIBC machinery supplier matching.",
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
