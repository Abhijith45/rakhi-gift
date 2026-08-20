/**
 * Central Mock Data for Personalized Rakhi Memory Gift
 * Single source of truth for recipient preview and 3D memory wall.
 */

export const mockGift = {
  id: "gift-demo-8x92k",
  slug: "aarav-8x92k",
  recipientName: "Aarav",
  senderName: "Ananya",
  relationship: "Brother",
  theme: "warm-memory",
  tagline: "To the best brother, teammate, and lifelong partner in crime.",
  
  // Emotional Rakhi Message
  message: {
    salutation: "Dearest Aarav,",
    body: "No matter how many miles separate us or how busy life gets, you will always be the first person I turn to when I need a laugh, an honest opinion, or someone to split the last slice of pizza. Thank you for always protecting me, cheering for my craziest dreams, and never letting me forget where we came from. Happy Raksha Bandhan! ❤️",
    signoff: "Forever your little sister,",
    sender: "Ananya"
  },

  // "Why You're Special" Items
  reasons: [
    {
      id: "reason-1",
      number: "01",
      title: "Always Having My Back",
      text: "Even when I made the worst mistakes, you never judged — you just helped me fix them."
    },
    {
      id: "reason-2",
      number: "02",
      title: "Our Secret Language of Looks",
      text: "We can communicate an entire paragraph across a crowded family dinner with one eyebrow raise."
    },
    {
      id: "reason-3",
      number: "03",
      title: "The Best Playlist Curator",
      text: "Every great road trip song I love today is because you played it in the car first."
    },
    {
      id: "reason-4",
      number: "04",
      title: "Unmatched Loyalty",
      text: "You'll roast me for an hour straight, but defend me fiercely against anyone else."
    }
  ],

  // Surprise Reveal Details
  surprise: {
    badge: "A Little Surprise For You",
    title: "One Last Promise...",
    message: "I booked our tickets for that concert we've been wanting to attend since 2019! Check your email this weekend for the dates. Here's to making 100 more ridiculous memories together.",
    giftVoucher: "FLIGHT & CONCERT PASS — NOVEMBER 2026",
    giftNote: "Claimable anytime. Non-negotiable sibling date!"
  },

  // 8 Curated Photos with Deterministic Wall Positions & Dimensions
  photos: [
    {
      id: "photo-1",
      title: "Childhood Chaos",
      caption: "When we thought mud puddles were swimming pools.",
      date: "Summer 2012",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.25, // width / height
      // Desktop 3D Wall Coordinates (X, Y, Z, RotationZ in deg)
      desktop: { x: -3.6, y: 1.35, z: 0.05, rotZ: -3.2, scale: 1.05 },
      // Mobile 3D Wall Coordinates
      mobile: { x: -1.2, y: 1.6, z: 0.05, rotZ: -2.0, scale: 0.85 },
      pin: { x: 0, y: 0.88, z: 0.12 }
    },
    {
      id: "photo-2",
      title: "First Cooking Disaster",
      caption: "Burnt maggi, smoked kitchen, but we laughed for hours.",
      date: "Diwali 2016",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.85,
      desktop: { x: -1.4, y: 1.5, z: 0.12, rotZ: 2.5, scale: 1.0 },
      mobile: { x: 1.2, y: 1.55, z: 0.08, rotZ: 2.2, scale: 0.85 },
      pin: { x: 0, y: 1.05, z: 0.12 }
    },
    {
      id: "photo-3",
      title: "Graduation Cheerleader",
      caption: "You yelled louder than anyone else in the auditorium.",
      date: "Spring 2020",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.3,
      desktop: { x: 1.2, y: 1.4, z: 0.04, rotZ: -2.0, scale: 1.08 },
      mobile: { x: -1.15, y: -0.1, z: 0.1, rotZ: -2.5, scale: 0.85 },
      pin: { x: 0, y: 0.85, z: 0.12 }
    },
    {
      id: "photo-4",
      title: "Terrace Sunset Talks",
      caption: "Solving all the world's problems over chai.",
      date: "Monsoon 2021",
      imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.9,
      desktop: { x: 3.5, y: 1.3, z: 0.1, rotZ: 3.4, scale: 0.98 },
      mobile: { x: 1.15, y: -0.15, z: 0.05, rotZ: 2.0, scale: 0.85 },
      pin: { x: 0, y: 1.0, z: 0.12 }
    },
    {
      id: "photo-5",
      title: "The Chaotic Road Trip",
      caption: "Flat tire, zero network, but the best playlist ever.",
      date: "Winter 2022",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.35,
      desktop: { x: -3.5, y: -1.35, z: 0.08, rotZ: 2.8, scale: 1.02 },
      mobile: { x: -1.1, y: -1.75, z: 0.08, rotZ: 1.8, scale: 0.85 },
      pin: { x: 0, y: 0.82, z: 0.12 }
    },
    {
      id: "photo-6",
      title: "First Driving Lesson",
      caption: "You almost panicked, but you never let go of the handbrake.",
      date: "Autumn 2023",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.88,
      desktop: { x: -1.25, y: -1.45, z: 0.02, rotZ: -3.0, scale: 0.95 },
      mobile: { x: 1.15, y: -1.7, z: 0.12, rotZ: -2.4, scale: 0.85 },
      pin: { x: 0, y: 1.02, z: 0.12 }
    },
    {
      id: "photo-7",
      title: "Last Year's Rakhi",
      caption: "Dressed up just to fight over the box of Kaju Katli.",
      date: "Raksha Bandhan 2024",
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.28,
      desktop: { x: 1.35, y: -1.35, z: 0.11, rotZ: 3.1, scale: 1.05 },
      mobile: { x: 0, y: -0.9, z: 0.06, rotZ: 0.5, scale: 0.8 },
      pin: { x: 0, y: 0.86, z: 0.12 }
    },
    {
      id: "photo-8",
      title: "Partners in Crime",
      caption: "Forever teammate, through thick and thin.",
      date: "Always",
      imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.88,
      desktop: { x: 3.55, y: -1.4, z: 0.06, rotZ: -2.2, scale: 1.0 },
      mobile: { x: 0, y: 0.8, z: 0.09, rotZ: -1.2, scale: 0.8 },
      pin: { x: 0, y: 1.0, z: 0.12 }
    }
  ],

  // Thread Connections (Pairings between photos to draw natural connecting red thread)
  threadConnections: [
    { from: "photo-1", to: "photo-2" },
    { from: "photo-2", to: "photo-3" },
    { from: "photo-3", to: "photo-4" },
    { from: "photo-4", to: "photo-8" },
    { from: "photo-8", to: "photo-7" },
    { from: "photo-7", to: "photo-6" },
    { from: "photo-6", to: "photo-5" },
    { from: "photo-2", to: "photo-6" }, // cross tension thread
    { from: "photo-3", to: "photo-7" }  // center anchor thread
  ]
};
