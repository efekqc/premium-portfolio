'use client';

import { motion } from 'framer-motion';

interface Dish {
  name: string;
  description?: string;
  price: string;
}

interface Category {
  title: string;
  index: string;
  dishes: Dish[];
}

const CATEGORIES: Category[] = [
  {
    index: '01',
    title: 'Soups',
    dishes: [
      {
        name: 'Chilled Almond & Black Garlic',
        description: 'sherry vinegar, smoked oil, marigold',
        price: '110',
      },
      {
        name: 'Roasted Chestnut Velouté',
        description: 'cured egg yolk, hazelnut, brown butter',
        price: '120',
      },
      {
        name: 'Smoked Tomato & Saffron',
        description: 'sourdough crisp, basil resin',
        price: '95',
      },
      {
        name: 'Beetroot Consommé',
        description: 'pickled rose petal, juniper smoke',
        price: '105',
      },
    ],
  },
  {
    index: '02',
    title: 'Kebabs',
    dishes: [
      {
        name: 'Adana with Pomegranate Glaze',
        description: 'aleppo pepper, urfa biber, charred shallot',
        price: '210',
      },
      {
        name: 'Lamb Shoulder & Cumin Smoke',
        description: 'twelve-hour braise, sumac, mint oil',
        price: '245',
      },
      {
        name: 'Saffron Prawn Skewer',
        description: 'preserved lemon, fennel pollen, dill',
        price: '230',
      },
      {
        name: 'Aubergine & Pul Biber',
        description: 'tahini, walnut, dried lime',
        price: '180',
      },
    ],
  },
  {
    index: '03',
    title: 'Pitas',
    dishes: [
      {
        name: 'Sourdough Pita with Hummus',
        description: 'charred onion, sesame oil, sumac',
        price: '95',
      },
      {
        name: "Manakish with Wild Thyme",
        description: 'aged labneh, olive, za’atar',
        price: '110',
      },
      {
        name: 'Black Garlic Flatbread',
        description: 'whipped butter, fermented chili',
        price: '105',
      },
      {
        name: 'Smoked Aubergine Wrap',
        description: 'walnut tarator, pickled cabbage',
        price: '125',
      },
    ],
  },
  {
    index: '04',
    title: 'Desserts',
    dishes: [
      {
        name: 'Honey-Soaked Baklava',
        description: 'pistachio, rosewater, cardamom cream',
        price: '85',
      },
      {
        name: 'Saffron Basbousa',
        description: 'orange blossom, mascarpone, bee pollen',
        price: '95',
      },
      {
        name: 'Pistachio Halva Parfait',
        description: 'tahini caramel, sea salt, mint',
        price: '90',
      },
      {
        name: 'Rose Sorbet',
        description: 'lychee, dried hibiscus, raspberry oil',
        price: '70',
      },
    ],
  },
  {
    index: '05',
    title: 'Drinks',
    dishes: [
      {
        name: 'Pomegranate Spritz',
        description: 'house vermouth, lavender, soda',
        price: '75',
      },
      {
        name: 'Fig Leaf Tonic',
        description: 'gin, fig leaf, juniper, citrus',
        price: '85',
      },
      {
        name: 'Cardamom Old Fashioned',
        description: 'rye, smoked maple, orange bitters',
        price: '95',
      },
      {
        name: 'Sumac Sour',
        description: 'mezcal, lime, sumac, egg white',
        price: '90',
      },
    ],
  },
];

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const RISE = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MenuSection() {
  return (
    <section
      id="menu"
      data-snap
      aria-label="Menu"
      className="relative bg-ink-800 py-24 sm:py-32 lg:py-40 px-5 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={STAGGER}
          className="text-center mb-16 sm:mb-24"
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
          <motion.h2
            variants={RISE}
            className="font-display font-light text-zinc-50 text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tightest-2"
          >
            Tonight&rsquo;s <span className="italic text-accent">selection</span>
            <span className="text-accent">.</span>
          </motion.h2>
          <motion.p
            variants={RISE}
            className="mt-5 text-sm sm:text-base text-zinc-400 max-w-md mx-auto"
          >
            A small, considered list — refreshed weekly with the harvest from
            our partner farms in Sjælland.
          </motion.p>
        </motion.div>

        {/* Categories */}
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-16 lg:gap-y-20">
          {CATEGORIES.map((cat) => (
            <CategoryBlock key={cat.title} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBlock({ cat }: { cat: Category }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={STAGGER}
    >
      <motion.div variants={RISE} className="flex items-baseline gap-4 mb-8">
        <span className="font-mono text-xs text-accent tabular-nums">
          {cat.index}
        </span>
        <h3 className="font-display italic text-3xl sm:text-4xl text-zinc-50 tracking-tight">
          {cat.title}
        </h3>
        <span className="flex-1 h-px bg-ink-700" />
      </motion.div>

      <ul className="space-y-6">
        {cat.dishes.map((dish) => (
          <motion.li
            key={dish.name}
            variants={RISE}
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
  );
}
