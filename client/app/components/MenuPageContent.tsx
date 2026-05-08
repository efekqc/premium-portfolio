'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PersianTexture } from './PersianTexture';

interface Dish {
  name: string;
  description?: string;
  price: string;
}

interface Category {
  index: string;
  title: string;
  blurb: string;
  /** Featured image for the category */
  image: string;
  imageAlt: string;
  /** Smaller item images (4) shown as a grid below the row */
  items: Array<{ src: string; alt: string }>;
  dishes: Dish[];
}

interface Props {
  /** Pool of seed image URLs to fill featured + small slots. */
  pool: Array<{ src: string; alt: string }>;
}

const CATEGORIES_DATA = [
  {
    index: '01',
    title: 'Soups',
    blurb:
      'Long-simmered, brought to the table at the table. Made the morning of, never the day before.',
    dishes: [
      { name: 'Chilled Almond & Black Garlic', description: 'sherry vinegar, smoked oil, marigold', price: '110' },
      { name: 'Roasted Chestnut Velouté', description: 'cured egg yolk, hazelnut, brown butter', price: '120' },
      { name: 'Smoked Tomato & Saffron', description: 'sourdough crisp, basil resin', price: '95' },
      { name: 'Beetroot Consommé', description: 'pickled rose petal, juniper smoke', price: '105' },
    ],
  },
  {
    index: '02',
    title: 'Mains · Kebabs',
    blurb:
      'Grilled over charcoal at 900°C. Each skewer rests under a cloche for the carry-over heat.',
    dishes: [
      { name: 'Adana with Pomegranate Glaze', description: 'aleppo pepper, urfa biber, charred shallot', price: '210' },
      { name: 'Lamb Shoulder & Cumin Smoke', description: 'twelve-hour braise, sumac, mint oil', price: '245' },
      { name: 'Saffron Prawn Skewer', description: 'preserved lemon, fennel pollen, dill', price: '230' },
      { name: 'Aubergine & Pul Biber', description: 'tahini, walnut, dried lime', price: '180' },
    ],
  },
  {
    index: '03',
    title: 'Pitas',
    blurb:
      'Sourdough flatbreads pulled from a wood-fired oven, finished with sea salt and fresh herb oil.',
    dishes: [
      { name: 'Sourdough Pita with Hummus', description: 'charred onion, sesame oil, sumac', price: '95' },
      { name: 'Manakish with Wild Thyme', description: 'aged labneh, olive, za’atar', price: '110' },
      { name: 'Black Garlic Flatbread', description: 'whipped butter, fermented chili', price: '105' },
      { name: 'Smoked Aubergine Wrap', description: 'walnut tarator, pickled cabbage', price: '125' },
    ],
  },
  {
    index: '04',
    title: 'Desserts',
    blurb:
      'Sweetness as architecture — temperature, fragrance, and one carefully chosen dairy.',
    dishes: [
      { name: 'Honey-Soaked Baklava', description: 'pistachio, rosewater, cardamom cream', price: '85' },
      { name: 'Saffron Basbousa', description: 'orange blossom, mascarpone, bee pollen', price: '95' },
      { name: 'Pistachio Halva Parfait', description: 'tahini caramel, sea salt, mint', price: '90' },
      { name: 'Rose Sorbet', description: 'lychee, dried hibiscus, raspberry oil', price: '70' },
    ],
  },
  {
    index: '05',
    title: 'Drinks',
    blurb:
      'Pairings are designed for each evening; the standalone list rotates monthly.',
    dishes: [
      { name: 'Pomegranate Spritz', description: 'house vermouth, lavender, soda', price: '75' },
      { name: 'Fig Leaf Tonic', description: 'gin, fig leaf, juniper, citrus', price: '85' },
      { name: 'Cardamom Old Fashioned', description: 'rye, smoked maple, orange bitters', price: '95' },
      { name: 'Sumac Sour', description: 'mezcal, lime, sumac, egg white', price: '90' },
    ],
  },
];

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MenuPageContent({ pool }: Props) {
  // Build categories with images sourced from the seed pool (cycle if pool is small)
  const fallback = {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80',
    alt: 'Plated dish',
  };
  function pick(i: number) {
    if (pool.length === 0) return fallback;
    return pool[i % pool.length];
  }
  const categories: Category[] = CATEGORIES_DATA.map((cat, i) => {
    const featured = pick(i * 5);
    const items = [pick(i * 5 + 1), pick(i * 5 + 2), pick(i * 5 + 3), pick(i * 5 + 4)];
    return {
      ...cat,
      image: featured.src,
      imageAlt: featured.alt,
      items,
    };
  });

  return (
    <div className="relative isolate bg-ink-800">
      <PersianTexture />

      {/* Page intro */}
      <section className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 sm:py-28 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={RISE}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="block h-px w-10 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              The Menu
            </span>
            <span className="block h-px w-10 bg-accent" />
          </motion.div>
          <motion.h1
            variants={RISE}
            className="font-display font-light text-balance text-5xl sm:text-6xl md:text-7xl leading-[0.96] tracking-tightest-2 text-zinc-50"
          >
            Tonight&rsquo;s <span className="italic text-accent">selection</span>
            <span className="text-accent">.</span>
          </motion.h1>
          <motion.p
            variants={RISE}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A small, considered list — refreshed weekly with the harvest from
            our partner farms in Sjælland. Wine pairings designed each evening
            by our sommelier.
          </motion.p>
        </motion.div>
      </section>

      {/* Categories — alternating layout */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pb-32 space-y-28 sm:space-y-36">
        {categories.map((cat, i) => (
          <CategoryBlock key={cat.title} cat={cat} flip={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}

function CategoryBlock({ cat, flip }: { cat: Category; flip: boolean }) {
  // Intentionally NOT a snap target — the menu reads top-to-bottom.
  // Five consecutive snap points would interrupt the reading flow.
  return (
    <section aria-label={cat.title} className="scroll-mt-24">
      {/* Featured row — image + dishes list */}
      <div
        className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          flip ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="group relative aspect-[4/5] lg:aspect-[3/4] lg:col-span-5 overflow-hidden rounded-2xl ring-1 ring-accent/15"
        >
          <Image
            src={cat.image}
            alt={cat.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="
              object-cover
              transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.07]
            "
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent"
          />
          <span className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-950/70 backdrop-blur-sm text-[10px] uppercase tracking-[0.28em] text-accent">
            {cat.index} · {cat.title}
          </span>
        </motion.figure>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="lg:col-span-7"
        >
          <motion.div variants={RISE} className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-xs text-accent tabular-nums">
              {cat.index}
            </span>
            <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl text-zinc-50 tracking-tight">
              {cat.title}
            </h2>
            <span className="flex-1 h-px bg-accent/20" />
          </motion.div>

          <motion.p
            variants={RISE}
            className="text-base text-zinc-400 leading-relaxed mb-8 max-w-xl"
          >
            {cat.blurb}
          </motion.p>

          <ul className="space-y-5">
            {cat.dishes.map((dish) => (
              <motion.li
                variants={RISE}
                key={dish.name}
                className="grid grid-cols-[1fr_auto] gap-x-4"
              >
                <div className="min-w-0">
                  <p className="text-base sm:text-lg text-zinc-100 font-medium leading-snug">
                    {dish.name}
                  </p>
                  {dish.description && (
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 italic leading-relaxed">
                      {dish.description}
                    </p>
                  )}
                </div>
                <p className="text-sm sm:text-base text-zinc-300 tabular-nums whitespace-nowrap">
                  {dish.price} <span className="text-zinc-600 text-xs">DKK</span>
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Smaller item images grid — scaled-down accents */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cat.items.map((item, i) => (
          <motion.figure
            key={`${cat.title}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.05,
            }}
            whileHover={{ y: -3 }}
            className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-accent/10"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="
                object-cover
                transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-110
              "
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/15 transition-colors duration-500"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
