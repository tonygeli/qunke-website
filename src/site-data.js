export const site = {
  brand: "Qunke",
  name: "Qunke Plastic Machinery",
  url: "https://qunke-machinery.com",
  email: "sales@qunke-machinery.com",
  whatsapp: "+86 000 0000 0000",
  address: "China plastic machinery manufacturing base",
  description:
    "Qunke builds plastic recycling, pelletizing, washing, crushing and pipe extrusion machinery for overseas factory buyers.",
  heroImage: "assets/images/qunke-plastic-machinery-hero.png"
};

export const nav = [
  ["Products", "products/"],
  ["Solutions", "solutions/"],
  ["Markets", "markets/indonesia/"],
  ["Videos", "videos/"],
  ["About", "about/"],
  ["Contact", "contact/"]
];

export const products = [
  {
    slug: "plastic-recycling-machine",
    name: "Plastic Recycling Machine",
    kicker: "Turnkey recycling lines",
    title: "Plastic Recycling Machine Manufacturer in China",
    description:
      "Modular recycling lines for PET bottles, PP PE film, woven bags, rigid plastics and mixed post-industrial plastic waste.",
    materials: ["PET bottles", "PP PE film", "HDPE bottles", "Woven bags", "Rigid plastics"],
    process: ["Sorting", "Crushing", "Washing", "Dewatering", "Drying", "Pelletizing or packing"],
    buyerFit:
      "Best for recycling plants, plastic processors and investors who need one supplier to design the full line from input material to final flakes or pellets.",
    cta: "Send us your material photo and target output."
  },
  {
    slug: "pet-bottle-washing-line",
    name: "PET Bottle Washing Line",
    kicker: "Bottle to clean flakes",
    title: "PET Bottle Washing Line for Clean Bottle Flakes",
    description:
      "Washing, label removal, crushing, hot washing, friction washing and drying modules for PET bottle recycling plants.",
    materials: ["Baled PET bottles", "Loose PET bottles", "Post-consumer PET containers"],
    process: ["Debaling", "Label removing", "Manual sorting", "Crushing", "Hot washing", "Rinsing", "Dewatering", "Drying"],
    buyerFit:
      "Built for buyers who need clean PET flakes for fiber, sheet, strapping or further pelletizing.",
    cta: "Request a PET washing layout."
  },
  {
    slug: "pp-pe-film-washing-line",
    name: "PP PE Film Washing Line",
    kicker: "Film washing",
    title: "PP PE Film Washing Line for Post-Consumer Film",
    description:
      "A washing line designed for agricultural film, packaging film, bags and soft plastic materials with high moisture and contamination.",
    materials: ["LDPE film", "LLDPE film", "PP bags", "Agricultural film", "Packaging film"],
    process: ["Shredding", "Friction washing", "Floating washing", "Dewatering", "Thermal drying", "Silo storage"],
    buyerFit:
      "Useful for recyclers handling dirty film and needing a stable feedstock for pelletizing.",
    cta: "Share your film contamination level."
  },
  {
    slug: "plastic-pelletizing-machine",
    name: "Plastic Pelletizing Machine",
    kicker: "Flakes to pellets",
    title: "Plastic Pelletizing Machine for Recycling Plants",
    description:
      "Pelletizing systems for washed flakes, film, rigid regrind and production scrap with feeding, extrusion, filtration and cutting modules.",
    materials: ["PP film", "PE film", "HDPE regrind", "LDPE scrap", "Washed flakes"],
    process: ["Feeding", "Compacting", "Extrusion", "Melt filtration", "Degassing", "Pellet cutting", "Cooling"],
    buyerFit:
      "Designed for factories turning plastic waste into reusable pellets for injection, extrusion or film blowing.",
    cta: "Get a pelletizing configuration."
  },
  {
    slug: "pp-pe-film-pelletizing-line",
    name: "PP PE Film Pelletizing Line",
    kicker: "Soft plastic pelletizing",
    title: "PP PE Film Pelletizing Line for Washed Film",
    description:
      "A film recycling pelletizing line with compactor feeding, single or double stage extrusion, screen changing and strand or water-ring cutting.",
    materials: ["Washed LDPE film", "PP woven bag", "PE packaging film", "Factory film scrap"],
    process: ["Compactor feeding", "Extrusion", "Degassing", "Filtration", "Pellet cutting", "Cooling", "Bagging"],
    buyerFit:
      "A practical match for buyers who already wash film and want stable recycled pellets.",
    cta: "Send your film type and moisture level."
  },
  {
    slug: "plastic-crusher-machine",
    name: "Plastic Crusher Machine",
    kicker: "Size reduction",
    title: "Plastic Crusher Machine for Bottles, Film and Rigid Plastics",
    description:
      "Crushing equipment for plastic recycling lines, production scrap recovery and pre-processing before washing or pelletizing.",
    materials: ["PET bottles", "HDPE containers", "PP sheets", "Plastic lumps", "Film scrap"],
    process: ["Feeding", "Cutting", "Screen sizing", "Discharge", "Dust control"],
    buyerFit:
      "Used by recyclers and factories that need controlled particle size before washing or extrusion.",
    cta: "Ask for blade and screen recommendations."
  },
  {
    slug: "pvc-pipe-extrusion-line",
    name: "PVC Pipe Extrusion Line",
    kicker: "Pipe extrusion",
    title: "PVC Pipe Extrusion Line for Building and Utility Pipe",
    description:
      "Extrusion lines for PVC pipe production, including extruder, die head, vacuum calibration, haul-off, cutting and stacking.",
    materials: ["PVC compound", "PVC powder blend", "Recycled PVC blend after testing"],
    process: ["Mixing", "Extrusion", "Vacuum calibration", "Cooling", "Haul-off", "Cutting", "Stacking"],
    buyerFit:
      "Suitable for pipe factories making drainage, conduit, water supply or building pipe products.",
    cta: "Tell us your pipe diameter range."
  },
  {
    slug: "hdpe-pipe-extrusion-line",
    name: "HDPE Pipe Extrusion Line",
    kicker: "PE pipe production",
    title: "HDPE Pipe Extrusion Line for Water and Cable Pipe",
    description:
      "HDPE pipe extrusion systems for water pipe, cable duct, irrigation pipe and industrial pipe production.",
    materials: ["HDPE resin", "PE compound", "Approved recycled PE blend"],
    process: ["Drying", "Extrusion", "Die forming", "Vacuum sizing", "Cooling", "Haul-off", "Cutting"],
    buyerFit:
      "Built for overseas factories that need reliable pipe production with diameter-specific line design.",
    cta: "Request a pipe line proposal."
  }
];

export const solutions = [
  {
    slug: "pet-bottle-recycling",
    name: "PET Bottle Recycling",
    title: "How to Recycle PET Bottles into Clean Flakes",
    description:
      "A complete workflow for turning post-consumer PET bottles into clean flakes through sorting, crushing, hot washing, rinsing and drying.",
    steps: ["Bottle input analysis", "Label and cap separation", "Crushing and hot washing", "Friction rinsing", "Moisture reduction", "Flake packing or pelletizing"],
    links: ["pet-bottle-washing-line", "plastic-crusher-machine", "plastic-recycling-machine"]
  },
  {
    slug: "pp-pe-film-recycling",
    name: "PP PE Film Recycling",
    title: "PP PE Film Recycling Line for Dirty Soft Plastics",
    description:
      "A washing and pelletizing route for agricultural film, packaging film, woven bags and other soft plastics.",
    steps: ["Material sorting", "Shredding", "Washing", "Dewatering", "Drying", "Pelletizing"],
    links: ["pp-pe-film-washing-line", "pp-pe-film-pelletizing-line", "plastic-pelletizing-machine"]
  },
  {
    slug: "agricultural-film-recycling",
    name: "Agricultural Film Recycling",
    title: "Plastic Recycling Machine for Agricultural Film",
    description:
      "A recycling configuration for soil-contaminated agricultural film, greenhouse film and irrigation film waste.",
    steps: ["Contamination check", "Pre-cutting", "High-friction washing", "Floating washing", "Drying", "Pelletizing test"],
    links: ["pp-pe-film-washing-line", "pp-pe-film-pelletizing-line"]
  },
  {
    slug: "turnkey-recycling-plant",
    name: "Turnkey Recycling Plant",
    title: "Turnkey Plastic Recycling Plant Solution",
    description:
      "Line planning for buyers who need one supplier to coordinate washing, drying, pelletizing, layout and commissioning support.",
    steps: ["Material sample review", "Output target", "Factory layout", "Equipment selection", "Testing before shipment", "Installation support"],
    links: ["plastic-recycling-machine", "plastic-pelletizing-machine", "plastic-crusher-machine"]
  }
];

export const markets = [
  {
    slug: "indonesia",
    name: "Indonesia",
    title: "Plastic Recycling Machine Supplier for Indonesia",
    description:
      "Plastic recycling machinery for Indonesian buyers processing PET bottles, PP PE film, woven bags and rigid plastic waste.",
    points: ["Common materials include PET bottles and flexible packaging.", "Project planning should consider humidity, power supply and spare parts.", "Send material photos before quotation to avoid oversized or undersized equipment."]
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    title: "Plastic Recycling Machine for Vietnam",
    description:
      "Recycling and extrusion machinery for Vietnamese processors, traders and factories expanding plastic waste recovery capacity.",
    points: ["Good fit for PET flakes, PE film and factory scrap projects.", "Line layout can be adapted to compact workshop space.", "Video machine testing helps buyers confirm configuration before shipment."]
  },
  {
    slug: "mexico",
    name: "Mexico",
    title: "Plastic Recycling Machine Supplier for Mexico",
    description:
      "Plastic washing, pelletizing and extrusion equipment for Mexican recycling businesses and plastic product manufacturers.",
    points: ["Useful for PET bottle recycling, HDPE containers and film scrap.", "Voltage and control cabinet configuration should be confirmed early.", "English and Spanish sales materials can be prepared for your team."]
  },
  {
    slug: "middle-east",
    name: "Middle East",
    title: "Plastic Recycling Machine for Middle East Buyers",
    description:
      "Plastic recycling equipment for buyers handling packaging waste, film, bottles, pipe scrap and production waste across Middle East markets.",
    points: ["Heat, dust and water quality should be considered in plant planning.", "Washing line water treatment and drying performance matter.", "Spare parts planning is important for remote service locations."]
  }
];

export const buyerScenarios = [
  {
    name: "New Recycling Plant",
    text: "For investors comparing PET bottle washing, film washing and pelletizing routes before buying a full line."
  },
  {
    name: "Factory Scrap Recovery",
    text: "For plastic product factories that want to convert internal scrap into reusable flakes or pellets."
  },
  {
    name: "Capacity Upgrade",
    text: "For existing recyclers replacing single machines or expanding washing, drying and pelletizing capacity."
  }
];

export const faqs = [
  ["How do I get an accurate quotation?", "Send material photos or videos, expected capacity, final product target and your country. Qunke can then recommend a line structure instead of quoting blindly."],
  ["Can Qunke customize the line?", "Yes. Layout, power configuration, feeding method, washing stages, drying system and pelletizing route should be matched to the material and factory space."],
  ["Can I see machine testing before shipment?", "Yes. A factory acceptance test video should be prepared before shipment, especially for complete washing and pelletizing lines."],
  ["Do you provide installation support?", "The installation plan depends on the project. Remote guidance, documents and on-site support can be arranged after confirming the final line scope."],
  ["What information should I send first?", "Material type, contamination level, moisture, target output, workshop size, local voltage and final product requirement."]
];
