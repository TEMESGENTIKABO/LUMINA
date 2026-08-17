import { PrismaClient, Role, ArticleStatus } from "@prisma/client";

const prisma = new PrismaClient();

// --- TipTap JSON body helpers ---
function p(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}
function h2(text: string) {
  return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] };
}
function doc(...blocks: object[]) {
  return { type: "doc", content: blocks };
}

async function main() {
  console.log("Seeding categories...");

  const news = await prisma.category.upsert({
    where: { slug: "news" },
    create: { slug: "news", name_en: "News", accentColor: "manuscript-red" },
    update: {},
  });
  const culture = await prisma.category.upsert({
    where: { slug: "culture" },
    create: { slug: "culture", name_en: "Culture", accentColor: "aksum-gold" },
    update: {},
  });
  const businessTech = await prisma.category.upsert({
    where: { slug: "business-tech" },
    create: { slug: "business-tech", name_en: "Business & Tech", accentColor: "lalibela-blue" },
    update: {},
  });

  const subcats = [
    { slug: "politics", name_en: "Politics", parentId: news.id, accentColor: "manuscript-red" },
    { slug: "africa", name_en: "Africa", parentId: news.id, accentColor: "manuscript-red" },
    { slug: "world", name_en: "World", parentId: news.id, accentColor: "manuscript-red" },
    { slug: "analysis", name_en: "Analysis", parentId: news.id, accentColor: "manuscript-red" },
    { slug: "entertainment", name_en: "Entertainment", parentId: culture.id, accentColor: "terracotta" },
    { slug: "music", name_en: "Music", parentId: culture.id, accentColor: "terracotta" },
    { slug: "film-tv", name_en: "Film & TV", parentId: culture.id, accentColor: "terracotta" },
    { slug: "arts-heritage", name_en: "Arts & Heritage", parentId: culture.id, accentColor: "aksum-gold" },
    { slug: "markets", name_en: "Markets & Economy", parentId: businessTech.id, accentColor: "lalibela-blue" },
    { slug: "startups", name_en: "Startups", parentId: businessTech.id, accentColor: "lalibela-blue" },
    { slug: "technology", name_en: "Technology", parentId: businessTech.id, accentColor: "lalibela-blue" },
    { slug: "diaspora-business", name_en: "Diaspora Business", parentId: businessTech.id, accentColor: "lalibela-blue" },
  ];
  const catMap: Record<string, string> = { news: news.id, culture: culture.id, "business-tech": businessTech.id };
  for (const c of subcats) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { parentId: c.parentId },
    });
    catMap[c.slug] = created.id;
  }
  const opinion = await prisma.category.upsert({
    where: { slug: "opinion" },
    create: { slug: "opinion", name_en: "Opinion", accentColor: "obsidian-grey" },
    update: {},
  });
  const investigations = await prisma.category.upsert({
    where: { slug: "investigations" },
    create: { slug: "investigations", name_en: "Investigations", accentColor: "manuscript-red" },
    update: {},
  });
  catMap["opinion"] = opinion.id;
  catMap["investigations"] = investigations.id;

  console.log("Seeding tags...");
  const tagNames = ["GERD", "Elections", "Startups", "Music", "Heritage", "Diaspora", "Climate", "AI"];
  const tagMap: Record<string, string> = {};
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.upsert({ where: { slug }, create: { slug, name }, update: {} });
    tagMap[name] = tag.id;
  }

  console.log("Seeding authors...");
  const authors = [
    { email: "selamawit.bekele@aksum.example.com", name: "Selamawit Bekele", slug: "selamawit-bekele", beat: "Politics & Investigations", bio: "Selamawit covers politics and regional affairs for AKSUM, with a focus on infrastructure and diplomacy.", role: Role.EDITOR },
    { email: "yonas.tesfaye@aksum.example.com", name: "Yonas Tesfaye", slug: "yonas-tesfaye", beat: "Business & Technology", bio: "Yonas writes about business, technology, and the diaspora economy.", role: Role.AUTHOR },
    { email: "bethlehem.alemu@aksum.example.com", name: "Bethlehem Alemu", slug: "bethlehem-alemu", beat: "Culture & Arts", bio: "Bethlehem covers culture, music, and the arts, with a focus on Ethiopian craft traditions.", role: Role.AUTHOR },
    { email: "dawit.girma@aksum.example.com", name: "Dawit Girma", slug: "dawit-girma", beat: "Opinion", bio: "Dawit is a columnist and regular contributor to AKSUM's Opinion section.", role: Role.AUTHOR },
    { email: "hanna.tadesse@aksum.example.com", name: "Hanna Tadesse", slug: "hanna-tadesse", beat: "World & Africa", bio: "Hanna reports on regional and international affairs affecting the Horn of Africa.", role: Role.AUTHOR },
    { email: "michael.abera@aksum.example.com", name: "Michael Abera", slug: "michael-abera", beat: "Markets & Economy", bio: "Michael covers markets, trade policy, and economic development.", role: Role.AUTHOR },
  ];
  const authorMap: Record<string, string> = {};
  for (const a of authors) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      create: { email: a.email, name: a.name, slug: a.slug, beat: a.beat, bio: a.bio, role: a.role, emailVerified: new Date() },
      update: { name: a.name, slug: a.slug, beat: a.beat, bio: a.bio, role: a.role },
    });
    authorMap[a.slug] = user.id;
  }

  console.log("Seeding articles...");

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);
  const daysFromNow = (n: number) => new Date(now + n * 24 * 60 * 60 * 1000);

  interface SeedArticle {
    slug: string; title_en: string; dek_en: string; category: string; author: string;
    image: string; tags: string[]; status: ArticleStatus; publishedAt?: Date; scheduledAt?: Date;
    isBreaking?: boolean; readTimeMinutes: number; body: object;
  }

  const articles: SeedArticle[] = [
    {
      slug: "gerd-power-output-milestone",
      title_en: "GERD Reaches Full Power Output Ahead of Schedule",
      dek_en: "Ethiopian officials confirm all turbines are now operational, months ahead of the original timeline.",
      category: "politics", author: "selamawit-bekele", image: "/images/gerd.svg",
      tags: ["GERD"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(0), isBreaking: true,
      readTimeMinutes: 6,
      body: doc(p("The Grand Ethiopian Renaissance Dam has reached full power output, officials confirmed Monday, months ahead of the timeline set out in the project's most recent construction update."), h2("What changed"), p("Engineers completed commissioning on the dam's final turbine over the weekend, bringing total installed capacity online for the first time since construction began."), p("The milestone arrives amid renewed diplomatic engagement with downstream nations over water-sharing arrangements that remain formally unresolved.")),
    },
    {
      slug: "addis-election-turnout-analysis",
      title_en: "What Turnout Data Actually Tells Us About Addis's Electorate",
      dek_en: "A precinct-by-precinct look at participation patterns across the capital's subcities.",
      category: "politics", author: "selamawit-bekele", image: "/images/politics.svg",
      tags: ["Elections"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(1),
      readTimeMinutes: 8,
      body: doc(p("Turnout figures released this week offer the clearest picture yet of how Addis Ababa's electorate is shifting - and the story is more complicated than either party's messaging suggests."), h2("The subcity breakdown"), p("Bole and Yeka saw turnout increases of roughly 6 and 4 percentage points respectively over the last comparable cycle, while turnout in Akaky Kaliti declined."), p("Analysts caution against reading too much into any single cycle's numbers without controlling for weather, registration changes, and local organizing efforts.")),
    },
    {
      slug: "au-summit-horn-security",
      title_en: "Horn of Africa Security Dominates AU Summit Agenda",
      dek_en: "Leaders convene in Addis Ababa as regional tensions complicate an already crowded agenda.",
      category: "africa", author: "hanna-tadesse", image: "/images/africa.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(2),
      readTimeMinutes: 5,
      body: doc(p("The African Union's latest summit opened Tuesday with Horn of Africa security concerns pushing several planned agenda items to a secondary session."), p("Delegates from member states spent much of the first day in closed-door consultations rather than the plenary sessions originally scheduled.")),
    },
    {
      slug: "red-sea-shipping-disruption",
      title_en: "Red Sea Disruptions Are Reshaping East African Trade Routes",
      dek_en: "Shipping delays are pushing exporters toward alternative ports and, in some cases, air freight.",
      category: "world", author: "hanna-tadesse", image: "/images/world.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(3),
      readTimeMinutes: 7,
      body: doc(p("Continued disruptions to Red Sea shipping lanes are forcing exporters across East Africa to reconsider routes that have been standard for decades."), h2("The cost of rerouting"), p("Freight forwarders report shipping times to European markets have roughly doubled for exporters unwilling to pay premium rates for alternative routing.")),
    },
    {
      slug: "gerd-five-years-analysis",
      title_en: "Five Years of GERD: An Honest Accounting",
      dek_en: "Beyond the headlines, what has actually changed for the communities living alongside the dam.",
      category: "analysis", author: "selamawit-bekele", image: "/images/analysis.svg",
      tags: ["GERD"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(5),
      readTimeMinutes: 9,
      body: doc(p("Five years after the first turbines came online, the Grand Ethiopian Renaissance Dam has reshaped more than the flow of the Blue Nile."), h2("What the data shows"), p("Domestic power access has measurably improved in regions connected to the new grid capacity, though rural connection rates still lag urban ones significantly."), p("The negotiations that were meant to be settled before completion remain, in the words of one regional diplomat, parked rather than resolved.")),
    },
    {
      slug: "ethio-jazz-new-generation",
      title_en: "Meet the Producers Reworking Ethio-Jazz for Streaming",
      dek_en: "A new generation of producers is bringing Mulatu Astatke's sound to a global streaming audience.",
      category: "music", author: "bethlehem-alemu", image: "/images/jazz.svg",
      tags: ["Music"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(1),
      readTimeMinutes: 5,
      body: doc(p("A wave of young producers is reworking classic Ethio-jazz recordings for a streaming-first audience, without losing what made the originals distinct."), p("The results are already showing up on playlists far outside Ethiopia's borders.")),
    },
    {
      slug: "addis-jazz-festival-2026",
      title_en: "Addis Jazz Festival Returns With a Younger Lineup",
      dek_en: "This year's festival leans into a new generation of Ethio-jazz fusion artists.",
      category: "music", author: "bethlehem-alemu", image: "/images/jazz.svg",
      tags: ["Music"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(4),
      readTimeMinutes: 3,
      body: doc(p("This year's Addis Jazz Festival lineup skews noticeably younger than in past years, a deliberate curatorial choice according to organizers.")),
    },
    {
      slug: "ethiopian-cinema-international-attention",
      title_en: "Ethiopian Cinema Is Getting International Attention Again",
      dek_en: "A handful of festival selections are putting Ethiopian filmmakers back on the international circuit.",
      category: "film-tv", author: "bethlehem-alemu", image: "/images/film.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(6),
      readTimeMinutes: 6,
      body: doc(p("Three Ethiopian features earned festival selections this year, the strongest showing the country's film industry has had in nearly a decade.")),
    },
    {
      slug: "mekelle-goldsmiths-revival",
      title_en: "The Jewelers Reviving Aksumite Gold Techniques",
      dek_en: "A small workshop in Mekelle is bringing 1,700-year-old metalworking methods back to life.",
      category: "arts-heritage", author: "bethlehem-alemu", image: "/images/jewelry.svg",
      tags: ["Heritage"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(8),
      readTimeMinutes: 6,
      body: doc(p("In a small workshop tucked behind a Mekelle market street, three goldsmiths are attempting something that hasn't been done at scale in centuries."), h2("The technique"), p("Granulation - fusing tiny gold spheres onto a surface without solder - requires a precision that mass production has largely abandoned.")),
    },
    {
      slug: "addis-fiber-rollout",
      title_en: "The Fiber Rollout Reshaping Addis's Tech Corridor",
      dek_en: "A citywide fiber expansion is quietly changing where startups choose to set up shop.",
      category: "technology", author: "yonas-tesfaye", image: "/images/startup.svg",
      tags: ["Startups"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(2),
      readTimeMinutes: 4,
      body: doc(p("A citywide fiber rollout is changing where founders choose to locate their teams, and it's not always where you'd expect.")),
    },
    {
      slug: "addis-startup-scene-2026",
      title_en: "Inside Addis Ababa's Quiet Startup Boom",
      dek_en: "Fintech and agri-tech founders are building for the domestic market first, and it's working.",
      category: "startups", author: "yonas-tesfaye", image: "/images/startup.svg",
      tags: ["Startups", "AI"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(3),
      readTimeMinutes: 5,
      body: doc(p("While much coverage of African tech fixates on Lagos and Nairobi, a quieter shift has been underway in Addis Ababa's startup corridor."), p("Founders here describe a deliberate strategy: build for Ethiopian users first, at Ethiopian price points.")),
    },
    {
      slug: "ai-adoption-ethiopian-banks",
      title_en: "Ethiopian Banks Are Quietly Adopting AI for Fraud Detection",
      dek_en: "Behind the scenes, several major banks have rolled out machine-learning fraud systems this year.",
      category: "technology", author: "yonas-tesfaye", image: "/images/technology.svg",
      tags: ["AI"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(7),
      readTimeMinutes: 5,
      body: doc(p("Several of Ethiopia's largest banks have rolled out machine-learning-based fraud detection systems over the past year, with little public announcement."), p("The shift reflects both rising digital transaction volume and pressure from international payment partners.")),
    },
    {
      slug: "birr-exchange-rate-policy",
      title_en: "What the New Exchange Rate Policy Means for Importers",
      dek_en: "A breakdown of the policy shift and who stands to gain or lose.",
      category: "markets", author: "michael-abera", image: "/images/markets.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(1),
      readTimeMinutes: 6,
      body: doc(p("A policy shift taking effect this quarter will change how importers access foreign currency, with significant implications for consumer goods pricing."), h2("Who is affected"), p("Import-dependent sectors, particularly electronics and pharmaceuticals, are expected to feel the effects first.")),
    },
    {
      slug: "diaspora-remittance-policy",
      title_en: "New Remittance Rules Explained",
      dek_en: "What the policy change means for diaspora families sending money home.",
      category: "diaspora-business", author: "michael-abera", image: "/images/remittance.svg",
      tags: ["Diaspora"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(9),
      readTimeMinutes: 4,
      body: doc(p("A policy change taking effect this quarter will alter how remittances are processed for thousands of diaspora families.")),
    },
    {
      slug: "diaspora-investment-funds",
      title_en: "The Rise of Diaspora-Backed Investment Funds",
      dek_en: "A handful of new funds are betting specifically on diaspora capital and diaspora-founded businesses.",
      category: "diaspora-business", author: "michael-abera", image: "/images/diaspora.svg",
      tags: ["Diaspora", "Startups"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(10),
      readTimeMinutes: 5,
      body: doc(p("A new class of investment funds is explicitly targeting diaspora capital, betting that shared cultural context gives them an edge over generalist investors.")),
    },
    {
      slug: "why-remittance-debate-misses-point",
      title_en: "Why the Remittance Debate Misses the Point",
      dek_en: "The policy conversation keeps focusing on volume. It should be focusing on velocity.",
      category: "opinion", author: "dawit-girma", image: "/images/opinion.svg",
      tags: ["Diaspora"], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(4),
      readTimeMinutes: 6,
      body: doc(p("Every year, the same debate resurfaces: are remittances a lifeline or a dependency? Both framings miss what actually matters."), p("This is an argument for redesigning the pipes, not re-litigating the plumbing's existence.")),
    },
    {
      slug: "case-for-slower-urban-planning",
      title_en: "The Case for Slower Urban Planning in Addis",
      dek_en: "Speed has become the default virtue in the capital's expansion. It shouldn't be.",
      category: "opinion", author: "dawit-girma", image: "/images/opinion.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(6),
      readTimeMinutes: 7,
      body: doc(p("Addis Ababa's expansion has been remarkably fast by any regional comparison. Fast is not the same as good."), p("A slower, more deliberate approach to zoning would cost time the city's leadership seems unwilling to spend.")),
    },
    {
      slug: "informal-land-deals-investigation",
      title_en: "The Hidden Cost of Informal Land Deals in Addis's Expansion Zones",
      dek_en: "A months-long investigation into off-book land transfers on the city's outskirts.",
      category: "investigations", author: "selamawit-bekele", image: "/images/gerd.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(12),
      readTimeMinutes: 11,
      body: doc(p("Over four months, AKSUM reviewed hundreds of pages of municipal records and spoke with more than twenty residents of Addis Ababa's rapidly expanding periphery."), h2("What the records show"), p("What emerged is a pattern of informal transfers that fall outside official channels entirely, leaving affected families with no legal recourse when disputes arise."), p("Municipal officials did not respond to repeated requests for comment on the record-keeping gaps identified in this investigation.")),
    },
    {
      slug: "textile-sector-labor-conditions",
      title_en: "Inside the Labor Conditions Powering Ethiopia's Textile Export Boom",
      dek_en: "A firsthand look at conditions in the industrial parks driving one of the country's fastest-growing export sectors.",
      category: "investigations", author: "hanna-tadesse", image: "/images/africa.svg",
      tags: [], status: ArticleStatus.PUBLISHED, publishedAt: daysAgo(15),
      readTimeMinutes: 10,
      body: doc(p("Ethiopia's textile export sector has grown rapidly over the past five years. The conditions inside the industrial parks driving that growth have received far less scrutiny."), h2("What workers described"), p("Multiple current and former workers described mandatory overtime that was not always reflected in pay, though park operators dispute this characterization.")),
    },
    {
      slug: "upcoming-drought-response-plan",
      title_en: "Government Prepares Drought Response Plan for Coming Dry Season",
      dek_en: "Officials say the plan will be finalized and announced next week.",
      category: "politics", author: "selamawit-bekele", image: "/images/politics.svg",
      tags: [], status: ArticleStatus.SCHEDULED, scheduledAt: daysFromNow(3),
      readTimeMinutes: 5,
      body: doc(p("Ethiopian officials are finalizing a drought response plan ahead of the coming dry season, according to two people familiar with the planning process.")),
    },
    {
      slug: "draft-review-agri-tech-funding",
      title_en: "Agri-Tech Funding Draft - Needs Second Source",
      dek_en: "Internal draft, not ready for publication.",
      category: "startups", author: "yonas-tesfaye", image: "/images/startup.svg",
      tags: ["Startups"], status: ArticleStatus.DRAFT,
      readTimeMinutes: 4,
      body: doc(p("Draft in progress. Need to confirm funding figures with a second source before this can move to review.")),
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title_en: a.title_en,
        dek_en: a.dek_en,
        body_en: a.body as any,
        heroImageUrl: a.image,
        categoryId: catMap[a.category],
        authorId: authorMap[a.author],
        status: a.status,
        publishedAt: a.publishedAt ?? null,
        scheduledAt: a.scheduledAt ?? null,
        isBreaking: a.isBreaking ?? false,
        readTimeMinutes: a.readTimeMinutes,
        tags: { create: a.tags.map((t) => ({ tagId: tagMap[t] })) },
      },
      update: {},
    });
  }

  console.log(`Seed complete: ${subcats.length + 5} categories, ${tagNames.length} tags, ${authors.length} authors, ${articles.length} articles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
