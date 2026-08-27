export interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price250: number;
  price500: number;
  image: string;
}

export interface GlassJarProduct {
  id: number;
  name: string;
  size1: string;
  price1: number;
  size2: string;
  price2: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Dry Fruit Sattu Laddoo",
    tagline: "Handful of Energy, Rolled Into One Bite",
    description:
      "Roasted sattu — a grain Indian kitchens have trusted for generations as a natural source of strength and stamina — packed with real dry fruits and slow-cooked desi ghee, sweetened with iron-rich jaggery. Eat it for breakfast when you're rushing out the door. Eat it before a workout when you need real fuel, not a sugar spike.",
    price250: 250,
    price500: 500,
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
  },

  {
    id: 2,
    name: "Besan Badam Laddoo",
    tagline: "The One That Tastes Like Sunday Afternoons",
    description:
      "Besan, slow-roasted until it turns nutty and golden. Almonds, for crunch. Desi ghee, for that unmistakable aroma the moment you open the box. Sweetened only with jaggery — because this laddoo doesn't need help pretending to be a childhood memory. It already is one.",
    price250: 215,
    price500: 430,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
  },

  {
    id: 3,
    name: "Dates Delight Laddoo",
    tagline: "No Sugar. No Jaggery. Just Nature, Doing What It Does Best.",
    description:
      "Dates, crushed nuts, roasted seeds, and desi ghee — bound together with nothing but their own natural sweetness. Rich, chewy, a little smoky from the roasting. The kind of energy that doesn't crash by 5pm.",
    price250: 315,
    price500: 630,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80",
  },

  {
    id: 4,
    name: "Sattu Laddoo",
    tagline: 'The Original Fitness Food, Long Before "Fitness Food" Was a Category',
    description:
      "Long before protein powders and energy bars, Indian households had sattu — a humble grain built for exactly this: quiet, steady, natural energy. This laddoo brings it back, made honestly, with desi ghee and jaggery and absolutely nothing else hiding inside.",
    price250: 165,
    price500: 330,
    image:
      "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=1000&q=80",
  },
];

export const glassJarProducts: GlassJarProduct[] = [
  {
    id: 1,
    name: "Dry Fruit Sattu Laddoo",
    size1: "350g",
    price1: 350,
    size2: "500g",
    price2: 500,
  },

  {
    id: 2,
    name: "Dates Delight Laddoo",
    size1: "350g",
    price1: 500,
    size2: "700g",
    price2: 700,
  },
];