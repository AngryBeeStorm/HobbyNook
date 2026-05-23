export const defaultRouletteItems = [
  {
    id: crypto.randomUUID(),
    name: "Crochet",
    color: "#d98973",
  },
  {
    id: crypto.randomUUID(),
    name: "Knitting",
    color: "#b48ead",
  },
  {
    id: crypto.randomUUID(),
    name: "Clay sculpting",
    color: "#e6a96b",
  },
  {
    id: crypto.randomUUID(),
    name: "Watercolor",
    color: "#88c0d0",
  },
  {
    id: crypto.randomUUID(),
    name: "Embroidery",
    color: "#a3be8c",
  },
  {
    id: crypto.randomUUID(),
    name: "Paper crafts",
    color: "#ebcb8b",
  },
];

export const sampleProjects = [
  {
    id: "project-1",
    title: "Crochet Flower Bookmark",
    category: "Crochet",
    status: "In progress",
    hoursSpent: 4.5,
    coverImage:
      "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=80",
    description:
      "A soft floral bookmark made with leftover cotton yarn. I want it to feel delicate, cozy, and a little vintage.",
    inspirationMood: "Soft spring morning",
    updates: [
      {
        id: 1,
        date: "2026-05-12",
        title: "Started petals",
        text: "Tested two flower shapes and picked the rounder one.",
        hours: 1.5,
      },
      {
        id: 2,
        date: "2026-05-14",
        title: "Added stem",
        text: "The first stem was too loose, so I switched to a tighter stitch.",
        hours: 3,
      },
    ],
  },
  {
    id: "project-2",
    title: "Tiny Clay Mushroom Charms",
    category: "Clay sculpting",
    status: "Planned",
    hoursSpent: 0,
    coverImage:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    description:
      "A small batch of handmade mushroom charms with warm earthy colors.",
    inspirationMood: "Forest trinket",
    updates: [],
  },
  {
    id: "project-3",
    title: "Patchwork Tote Bag",
    category: "Sewing",
    status: "Paused",
    hoursSpent: 8,
    coverImage:
      "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&w=900&q=80",
    description:
      "A tote bag made from fabric scraps. The goal is cheerful but still wearable every day.",
    inspirationMood: "Playful market day",
    updates: [
      {
        id: 1,
        date: "2026-05-08",
        title: "Selected fabric",
        text: "Grouped scraps by warmth and pattern size.",
        hours: 2,
      },
      {
        id: 2,
        date: "2026-05-10",
        title: "Made first layout",
        text: "The initial layout looked too busy. Need more neutral pieces.",
        hours: 6,
      },
    ],
  },
];

export const inspirationImages = [
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80",
];

export const inspirationWords = [
  "soft",
  "botanical",
  "mended",
  "tiny",
  "layered",
  "cozy",
  "sunlit",
  "playful",
  "heirloom",
  "textured",
  "dreamy",
  "earthy",
  "delicate",
  "patchwork",
  "nostalgic",
  "bright",
  "quiet",
  "whimsical",
];

export const inspirationMoods = [
  "Forest afternoon",
  "Grandma's sewing drawer",
  "Rainy day studio",
  "Pastel market morning",
  "Messy desk magic",
  "Soft cottage evening",
  "Colorful thrift treasure",
  "Calm handmade ritual",
];

export const inspirationPalettes = [
  ["#f7c8d0", "#f4e1b8", "#b7d7a8", "#8ecae6"],
  ["#d8b4a0", "#f4e3c1", "#a3b18a", "#6b705c"],
  ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe"],
  ["#e9c46a", "#f4a261", "#e76f51", "#2a9d8f"],
  ["#ede0d4", "#ddb892", "#b08968", "#7f5539"],
  ["#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"],
  ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf"],
  ["#6d6875", "#b5838d", "#ffb4a2", "#e5989b"],
  ["#81b29a", "#f2cc8f", "#e07a5f", "#3d405b"],
  ["#f0efeb", "#c9ada7", "#9a8c98", "#5d576b"],
];