export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "raising-quail-in-sri-lanka",
    tag: "Farm Life",
    title: "Why we chose quail farming in Kalmunai",
    excerpt:
      "Quail are hardy, low-maintenance birds that thrive in the Eastern Province. Learn how Kumaran Natural Products started with a small flock and grew into supplying Cargills Food City and Keells.",
    readTime: "4 min read",
    publishedAt: "2024-11-10",
    sections: [
      {
        paragraphs: [
          "Kumaran Natural Products began on a small plot of land in Kalmunai, in the Eastern Province of Sri Lanka. The choice of quail — rather than chicken or duck — was deliberate. Quail reach laying age in just six weeks, need far less feed per egg than chickens, and are naturally resilient to the humid coastal climate of the East.",
          "When we started, we had fewer than two hundred birds. Within eighteen months we had scaled to thousands, supplying eggs and meat in 500g and 1000g vacuum-sealed packets to private buyers and, eventually, to branches of Cargills Food City and Keells across multiple districts.",
        ],
      },
      {
        heading: "Why the Eastern Province?",
        paragraphs: [
          "Kalmunai sits on the eastern coast, where temperatures stay warm year-round with regular rainfall. Quail thrive in these conditions. Local feed — primarily grains sourced from nearby suppliers — keeps our input costs predictable and supports the regional agricultural economy at the same time.",
          "We also saw a gap. Supermarket shelves in Batticaloa and Ampara districts carried very few local quail products. Most quail eggs on the market were imported or travelled long distances from the Western Province, arriving older and more expensive. Producing locally meant fresher eggs on shelves within 24 hours of packing.",
        ],
      },
      {
        heading: "The daily routine",
        paragraphs: [
          "Every morning begins at dawn. Birds are checked, feed and water topped up, and the previous evening's eggs collected, candled for quality, and moved to our packing area. Each batch is weighed, counted, and sealed before our vehicle loads for the day's supply run to supermarket branches.",
          "Returns — packets that come back unsold or past best-before — are tracked carefully. That discipline keeps our quality reputation intact and helps us understand which branches need more frequent visits.",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [
          "We are currently expanding our flock, adding a dedicated cold room, and extending supply to more branches in the Northern and North-Central Provinces. The goal is to make Kumaran Natural Products quail eggs and meat available across the island, always fresh, always traceable from our farm to the packet on the shelf.",
        ],
      },
    ],
  },

  {
    slug: "quail-eggs-nutrition",
    tag: "Nutrition",
    title: "5 reasons quail eggs are a superfood",
    excerpt:
      "Packed with protein, iron, and vitamins — quail eggs punch well above their weight. Here's what the science says and how to add them to your family meals.",
    readTime: "3 min read",
    publishedAt: "2024-12-03",
    sections: [
      {
        paragraphs: [
          "Quail eggs have been eaten across Asia, the Middle East, and Europe for centuries. In recent years, nutritionists have paid closer attention to their unique profile — and the results are impressive for an egg that fits in the palm of your hand.",
        ],
      },
      {
        heading: "1. Exceptionally high protein density",
        paragraphs: [
          "Quail eggs contain around 13g of protein per 100g — comparable to chicken eggs — but their smaller size means you naturally eat several at once, boosting protein intake without feeling heavy. The amino acid profile is complete, making them excellent for muscle repair and everyday energy.",
        ],
      },
      {
        heading: "2. Rich in iron and B-vitamins",
        paragraphs: [
          "A single serving of quail eggs delivers a meaningful dose of iron, B12, and riboflavin (B2). Iron supports red blood cell production — particularly relevant in Sri Lanka where iron-deficiency anaemia remains common. B12 supports nerve health and energy metabolism.",
        ],
      },
      {
        heading: "3. High in choline for brain health",
        paragraphs: [
          "Choline is an essential nutrient critical for brain development in children and cognitive function in adults. Quail eggs are one of the most choline-dense foods available, making them a valuable addition to children's diets and for older adults maintaining mental sharpness.",
        ],
      },
      {
        heading: "4. Lower allergenic potential than chicken eggs",
        paragraphs: [
          "Some people who are sensitive to chicken eggs tolerate quail eggs well. While this is not universal and anyone with a known egg allergy should consult their doctor first, quail eggs contain different proportions of key proteins such as ovomucoid, which some researchers believe reduces the allergenic response in sensitive individuals.",
        ],
      },
      {
        heading: "5. Versatile in Sri Lankan cooking",
        paragraphs: [
          "Quail eggs work beautifully in traditional Sri Lankan dishes. Add them whole to kottu, nestle them in a mild curry, pickle them for a snack, or soft-boil and serve with pol sambol. Because they cook in under three minutes, they fit naturally into fast weekday meals.",
          "Our 500g packets contain enough eggs for a full family meal. Try boiling a dozen, peeling them while still warm, and finishing them in a tempered coconut milk gravy with turmeric and green chilli — a simple, nutritious dinner ready in fifteen minutes.",
        ],
      },
    ],
  },

  {
    slug: "supply-to-cargills",
    tag: "Business",
    title: "From our farm gate to Cargills Food City",
    excerpt:
      "We walk you through our daily supply run — quality checks, cold-chain handling, and the standards we hold ourselves to every single morning.",
    readTime: "5 min read",
    publishedAt: "2025-01-15",
    sections: [
      {
        paragraphs: [
          "Getting fresh quail eggs and meat from a farm in Kalmunai to a Cargills Food City branch in a different district is not as simple as loading a van. It requires a consistent process, strict quality gates, and a relationship of trust built over time with the supermarket's receiving staff.",
          "Here is how we do it, every day.",
        ],
      },
      {
        heading: "Packing starts the night before",
        paragraphs: [
          "The evening before a supply run, our team weighs and counts products for each destination branch. Packets are vacuum-sealed on-site, labelled with the production date, best-before date, batch number, and net weight. Every batch gets a unique identifier so we can trace any packet back to the flock and feed lot it came from.",
        ],
      },
      {
        heading: "Morning quality gate",
        paragraphs: [
          "Before loading, a supervisor checks a sample from each batch — appearance, seal integrity, and weight. Any packet outside tolerance is set aside. We would rather leave a packet behind than have it returned from a branch or, worse, reach a customer below standard.",
          "Quail eggs are candled to detect cracked shells or cloudy yolks. Meat packets are checked for colour and seal. Products are moved to our vehicle in insulated crates to maintain temperature during transit.",
        ],
      },
      {
        heading: "The supply run",
        paragraphs: [
          "Our driver follows a fixed route designed to minimise time between farm and shelf. Each branch receives its order along with a delivery note listing every product, quantity, selling price, and the corresponding batch numbers. The branch's receiving staff sign off on arrival, and we log any discrepancies immediately.",
          "For Cargills Food City and Keells branches, selling prices are agreed per product type — our pricing reflects the chain's category. Private supermarkets may carry a different price. This structure is what allows us to be fair to each partner while keeping our own margins predictable.",
        ],
      },
      {
        heading: "Returns and follow-ups",
        paragraphs: [
          "Approximately eleven days after each supply, we check in with the branch. Unsold or near-expiry stock is collected and counted — these returns are logged against the original supply so our profitability figures stay accurate. A high return rate at a specific branch triggers a review: is the branch receiving too much stock? Is shelf placement poor? We would rather adjust quantities than let returns climb.",
          "This discipline is what lets us offer consistent freshness to Cargills and Keells — and it is why branches request more stock when they trust that we will honour the relationship.",
        ],
      },
    ],
  },

  {
    slug: "quail-meat-lean-protein",
    tag: "Nutrition",
    title: "Quail meat: the lean protein Sri Lanka needs",
    excerpt:
      "Lower in fat than chicken, higher in iron than beef — quail meat is one of the most nutritious proteins you can add to your weekly menu. Here's what sets it apart.",
    readTime: "4 min read",
    publishedAt: "2025-02-20",
    sections: [
      {
        paragraphs: [
          "Most Sri Lankan households rotate between chicken, fish, and occasionally beef or mutton. Quail meat sits outside the mainstream — but it shouldn't. Per gram of meat, quail delivers a nutrition profile that compares favourably with every common alternative, and it costs less to produce responsibly than broiler chicken raised at industrial scale.",
        ],
      },
      {
        heading: "The numbers that matter",
        paragraphs: [
          "Quail meat is remarkably lean. A 100g serving carries around 25g of protein and as little as 4–5g of fat, depending on cut and cooking method. Compare that to chicken thigh (around 16g protein, 9g fat per 100g) or beef mince (around 18g protein, 14g fat). For anyone managing weight, blood sugar, or cardiovascular health, quail is a clear winner.",
          "Iron content is another standout. Quail meat provides more haem iron per 100g than chicken — haem iron is the form most readily absorbed by the body, making quail genuinely useful for preventing and addressing iron deficiency, which is widespread across Sri Lanka.",
        ],
      },
      {
        heading: "How we prepare and pack quail meat",
        paragraphs: [
          "Our quail meat is butchered, cleaned, and vacuum-sealed on the same day as processing. Packets come in 500g and 1000g sizes — enough for a family curry or a smaller portion for one or two people. Vacuum sealing without artificial preservatives keeps the meat fresh for up to five days refrigerated and significantly longer frozen.",
          "The butcher cost is one of the three components in our cost-price calculation, alongside packing and the product cost itself. We are transparent about this because consistent quality in processing is what keeps the meat safe and the flavour clean.",
        ],
      },
      {
        heading: "Cooking ideas",
        paragraphs: [
          "Quail meat is tender and cooks faster than chicken — whole birds are ready in twenty minutes, cut pieces in ten. It works well in black pepper curry, devilled preparations, or simply marinated with turmeric, chilli, and lime and grilled. The mild flavour absorbs Sri Lankan spice blends beautifully without becoming overpowering.",
          "Try our 500g packet in a coconut milk curry with potato and green beans — a meal that costs less than a restaurant portion of chicken and delivers far more protein per serving.",
        ],
      },
    ],
  },

  {
    slug: "batch-quality-control",
    tag: "Farm Life",
    title: "How we ensure quality in every batch",
    excerpt:
      "From flock health to shelf placement, quality at Kumaran Natural Products is a process, not an afterthought. We break down every step we take before a packet reaches a supermarket.",
    readTime: "5 min read",
    publishedAt: "2025-03-08",
    sections: [
      {
        paragraphs: [
          "When a customer picks up a packet of Kumaran Natural Products quail eggs at Cargills Food City, they are holding the result of a multi-step quality process that began weeks earlier. Quality for us is not a final check — it is built into every stage from flock management to delivery.",
        ],
      },
      {
        heading: "Flock health and feed",
        paragraphs: [
          "Healthy birds produce high-quality eggs and meat. Our flock is monitored daily for signs of illness, feather condition, and laying rates. Feed is sourced from trusted local suppliers and stored in dry, sealed bins to prevent mould. We track each feed purchase — supplier, quantity, cost, and date — so that if a quality issue ever emerges, we can trace it back to the input.",
          "Water quality is checked and containers cleaned on a fixed schedule. Stress in the flock — from overcrowding, heat, or inconsistent lighting — directly affects egg quality and shell integrity, so housing conditions are maintained carefully.",
        ],
      },
      {
        heading: "Batch numbers and traceability",
        paragraphs: [
          "Every production batch receives a unique batch number tied to the date, the product (egg or meat, 500g or 1000g), and the cost price applicable at that time. This number goes onto the label of every packet produced from that batch. If a branch ever reports a quality issue with a specific delivery, we can pull the batch record and review everything from feed lot to packing conditions on that day.",
        ],
      },
      {
        heading: "Packing and sealing",
        paragraphs: [
          "Packing happens in a dedicated, clean area separate from the bird housing. Staff wear clean gloves and aprons. Vacuum sealing removes oxygen from the pack, slowing bacterial growth without using any preservatives. We check seal integrity on every packet — a failed seal is discarded immediately, not reworked.",
          "Best-before dates are calculated conservatively. We would rather a customer finds our product fresher than the date suggests than the reverse.",
        ],
      },
      {
        heading: "Delivery and shelf management",
        paragraphs: [
          "Packets travel to branches in insulated crates. On arrival, the branch receiving staff inspect a sample — our delivery note makes this easy by listing batch numbers, quantities, and weights. Any batch rejected at delivery is logged and never reshipped.",
          "We follow up with branches around eleven days after supply. This lets us catch stock that is moving slowly before it approaches the best-before date, adjust quantities for the next delivery, and collect returns cleanly. The return rate by product and reason is tracked — it is one of the clearest signals we have about where our quality process can still improve.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 2): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== slug).slice(0, count);
}
