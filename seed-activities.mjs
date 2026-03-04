import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

import mongoose from 'mongoose';
import Activity from './src/models/Activity.js';
import { connectToDB } from './src/mongodb/index.js';

const activities = [
  {
    name: "Skydiving Over Dubai",
    description: "Experience the thrill of freefalling over the iconic Palm Jumeirah and Dubai skyline from 13,000 feet with professional instructors.",
    location: "Skydive Dubai - Desert Campus",
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    category: "Adventure",
    duration: { value: 3, unit: "hours" },
    difficulty: "Challenging",
    priceRange: "Expensive",
    price: { amount: 595, currency: "USD" },
    rating: 4.9,
    reviewCount: 3421,
    images: [
      "https://images.unsplash.com/photo-1522775559573-1741534db64e?w=800",
      "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800"
    ],
    bestTimeToVisit: ["October", "November", "December", "January", "February", "March"],
    tags: ["Adrenaline", "Bucket List", "Extreme Sport", "Aerial Views"],
    includedInPrice: ["Tandem jump", "Professional instructor", "Equipment", "Video recording", "Certificate"],
    whatToBring: ["Valid ID", "Comfortable clothes", "Closed shoes"],
    ageRestriction: { min: 18, max: 70 },
    groupSize: { min: 1, max: 8 },
    bookingRequired: true,
    website: "https://www.skydivedubai.ae",
    coordinates: { latitude: 25.1272, longitude: 55.1938 }
  },
  {
    name: "Machu Picchu Guided Trek",
    description: "4-day Inca Trail trek to the ancient citadel of Machu Picchu, passing through cloud forests and archaeological sites.",
    location: "Inca Trail",
    city: "Cusco",
    country: "Peru",
    continent: "South America",
    category: "Adventure",
    duration: { value: 4, unit: "days" },
    difficulty: "Challenging",
    priceRange: "Expensive",
    price: { amount: 780, currency: "USD" },
    rating: 4.8,
    reviewCount: 5678,
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800"
    ],
    bestTimeToVisit: ["May", "June", "July", "August", "September"],
    tags: ["Hiking", "UNESCO Site", "Ancient Ruins", "Mountains"],
    includedInPrice: ["Professional guide", "Camping equipment", "Meals", "Entrance fees", "Porter service"],
    whatToBring: ["Hiking boots", "Sleeping bag", "Rain gear", "Water bottle", "Sunscreen"],
    ageRestriction: { min: 12, max: 65 },
    groupSize: { min: 2, max: 16 },
    bookingRequired: true,
    coordinates: { latitude: -13.1631, longitude: -72.5450 }
  },
  {
    name: "Tokyo Food Tour",
    description: "Explore Tokyo's culinary scene from street food stalls to hidden izakayas, tasting sushi, ramen, yakitori, and more with a local guide.",
    location: "Shibuya & Shinjuku Districts",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    category: "Food & Drink",
    duration: { value: 3, unit: "hours" },
    difficulty: "Easy",
    priceRange: "Mid-range",
    price: { amount: 125, currency: "USD" },
    rating: 4.9,
    reviewCount: 4234,
    images: [
      "https://images.unsplash.com/photo-1613214149421-07d5b61f7b8d?w=800",
      "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800"
    ],
    bestTimeToVisit: ["All year"],
    tags: ["Foodie", "Local Experience", "Street Food", "Cultural"],
    includedInPrice: ["English-speaking guide", "7+ food tastings", "Drinks", "Local transport during tour"],
    whatToBring: ["Comfortable shoes", "Empty stomach", "Camera"],
    ageRestriction: { min: 8, max: 100 },
    groupSize: { min: 2, max: 12 },
    bookingRequired: true,
    website: "https://www.tokyofoodtours.com",
    coordinates: { latitude: 35.6762, longitude: 139.6503 }
  },
  {
    name: "Northern Lights Safari",
    description: "Chase the Aurora Borealis in the Arctic wilderness, including snowmobile ride, warm meal, and expert photography guidance.",
    location: "Lapland Wilderness",
    city: "Tromsø",
    country: "Norway",
    continent: "Europe",
    category: "Nature",
    duration: { value: 6, unit: "hours" },
    difficulty: "Moderate",
    priceRange: "Expensive",
    price: { amount: 245, currency: "USD" },
    rating: 4.7,
    reviewCount: 2156,
    images: [
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800"
    ],
    bestTimeToVisit: ["September", "October", "November", "December", "January", "February", "March"],
    tags: ["Northern Lights", "Photography", "Arctic", "Once in a Lifetime"],
    includedInPrice: ["Snowmobile", "Thermal suit", "Hot meal", "Photography tips", "Hotel pickup"],
    whatToBring: ["Warm layers", "Camera", "Gloves"],
    ageRestriction: { min: 16, max: 75 },
    groupSize: { min: 4, max: 20 },
    bookingRequired: true,
    coordinates: { latitude: 69.6492, longitude: 18.9553 }
  },
  {
    name: "Louvre Museum Guided Tour",
    description: "Skip-the-line access to the world's largest art museum, featuring the Mona Lisa, Venus de Milo, and expert art historian guide.",
    location: "Musée du Louvre",
    city: "Paris",
    country: "France",
    continent: "Europe",
    category: "Cultural",
    duration: { value: 3, unit: "hours" },
    difficulty: "Easy",
    priceRange: "Mid-range",
    price: { amount: 65, currency: "USD" },
    rating: 4.6,
    reviewCount: 8945,
    images: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800"
    ],
    bestTimeToVisit: ["All year"],
    tags: ["Art", "Museum", "Skip the Line", "UNESCO Site"],
    includedInPrice: ["Skip-the-line entry", "Expert guide", "Headsets", "Museum highlights"],
    whatToBring: ["Comfortable shoes", "Camera (no flash)", "Water bottle"],
    ageRestriction: { min: 5, max: 100 },
    groupSize: { min: 1, max: 25 },
    bookingRequired: true,
    website: "https://www.louvre.fr",
    coordinates: { latitude: 48.8606, longitude: 2.3376 }
  },
  {
    name: "Great Barrier Reef Snorkeling",
    description: "Full-day boat trip to the Great Barrier Reef with snorkeling equipment, marine biologist guide, and underwater photography.",
    location: "Great Barrier Reef",
    city: "Cairns",
    country: "Australia",
    continent: "Australia",
    category: "Nature",
    duration: { value: 8, unit: "hours" },
    difficulty: "Easy",
    priceRange: "Expensive",
    price: { amount: 195, currency: "USD" },
    rating: 4.8,
    reviewCount: 6432,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800"
    ],
    bestTimeToVisit: ["June", "July", "August", "September", "October"],
    tags: ["Snorkeling", "Marine Life", "UNESCO Site", "Coral Reef"],
    includedInPrice: ["Boat transfer", "Snorkeling gear", "Lunch", "Marine biologist guide", "Underwater camera"],
    whatToBring: ["Swimsuit", "Towel", "Sunscreen (reef-safe)", "Seasickness medication"],
    ageRestriction: { min: 4, max: 80 },
    groupSize: { min: 2, max: 40 },
    bookingRequired: true,
    coordinates: { latitude: -16.9186, longitude: 145.7781 }
  },
  {
    name: "Safari Game Drive",
    description: "Morning and evening game drives in Serengeti National Park with expert ranger, spotting lions, elephants, and the Big Five.",
    location: "Serengeti National Park",
    city: "Arusha",
    country: "Tanzania",
    continent: "Africa",
    category: "Nature",
    duration: { value: 1, unit: "days" },
    difficulty: "Easy",
    priceRange: "Expensive",
    price: { amount: 350, currency: "USD" },
    rating: 4.9,
    reviewCount: 3876,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800"
    ],
    bestTimeToVisit: ["June", "July", "August", "September", "October"],
    tags: ["Safari", "Wildlife", "Big Five", "Photography"],
    includedInPrice: ["4x4 safari vehicle", "Expert ranger", "Park fees", "Meals", "Water"],
    whatToBring: ["Binoculars", "Camera with zoom lens", "Hat", "Sunscreen"],
    ageRestriction: { min: 6, max: 85 },
    groupSize: { min: 2, max: 6 },
    bookingRequired: true,
    coordinates: { latitude: -2.3333, longitude: 34.8333 }
  },
  {
    name: "Hot Air Balloon Ride Cappadocia",
    description: "Sunrise hot air balloon flight over Cappadocia's fairy chimneys and valleys, with champagne celebration upon landing.",
    location: "Göreme Valley",
    city: "Cappadocia",
    country: "Turkey",
    continent: "Asia",
    category: "Adventure",
    duration: { value: 3, unit: "hours" },
    difficulty: "Easy",
    priceRange: "Expensive",
    price: { amount: 220, currency: "USD" },
    rating: 4.9,
    reviewCount: 7821,
    images: [
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
    ],
    bestTimeToVisit: ["April", "May", "September", "October"],
    tags: ["Hot Air Balloon", "Sunrise", "Scenic", "Romantic"],
    includedInPrice: ["Balloon flight", "Light breakfast", "Champagne toast", "Flight certificate", "Hotel transfer"],
    whatToBring: ["Warm jacket", "Camera", "Comfortable shoes"],
    ageRestriction: { min: 6, max: 80 },
    groupSize: { min: 2, max: 20 },
    bookingRequired: true,
    coordinates: { latitude: 38.6431, longitude: 34.8289 }
  },
  {
    name: "Yoga Retreat in Bali",
    description: "3-day wellness retreat featuring daily yoga sessions, meditation, healthy meals, and traditional Balinese healing treatments.",
    location: "Ubud Yoga Center",
    city: "Ubud",
    country: "Indonesia",
    continent: "Asia",
    category: "Wellness",
    duration: { value: 3, unit: "days" },
    difficulty: "Easy",
    priceRange: "Mid-range",
    price: { amount: 450, currency: "USD" },
    rating: 4.8,
    reviewCount: 2134,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"
    ],
    bestTimeToVisit: ["April", "May", "June", "September", "October"],
    tags: ["Yoga", "Wellness", "Meditation", "Holistic"],
    includedInPrice: ["Accommodation", "Yoga classes", "Meditation sessions", "Vegetarian meals", "Massage"],
    whatToBring: ["Yoga mat (optional)", "Comfortable clothes", "Journal", "Open mind"],
    ageRestriction: { min: 18, max: 75 },
    groupSize: { min: 5, max: 20 },
    bookingRequired: true,
    coordinates: { latitude: -8.5069, longitude: 115.2625 }
  },
  {
    name: "Broadway Theater Show",
    description: "Premium orchestra seats to a top-rated Broadway musical in New York's Theater District, with optional backstage tour.",
    location: "Broadway Theater District",
    city: "New York",
    country: "United States",
    continent: "North America",
    category: "Entertainment",
    duration: { value: 3, unit: "hours" },
    difficulty: "Easy",
    priceRange: "Expensive",
    price: { amount: 185, currency: "USD" },
    rating: 4.7,
    reviewCount: 5432,
    images: [
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800"
    ],
    bestTimeToVisit: ["All year"],
    tags: ["Theater", "Broadway", "Musical", "Entertainment"],
    includedInPrice: ["Orchestra seat ticket", "Playbill", "Optional backstage tour"],
    whatToBring: ["Smart casual attire", "Camera (no flash during show)"],
    ageRestriction: { min: 4, max: 100 },
    groupSize: { min: 1, max: 50 },
    bookingRequired: true,
    website: "https://www.broadway.com",
    coordinates: { latitude: 40.7589, longitude: -73.9851 }
  }
];

async function seedActivities() {
  try {
    await connectToDB();
    console.log('🎭 Starting activities seeding...');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('✅ Cleared existing activities');

    // Insert new activities
    const result = await Activity.insertMany(activities);
    console.log(`✅ Successfully seeded ${result.length} activities`);

    console.log('\n📊 Activities by category:');
    const categories = [...new Set(activities.map(a => a.category))];
    categories.forEach(category => {
      const count = activities.filter(a => a.category === category).length;
      console.log(`   ${category}: ${count} activities`);
    });

    console.log('\n🌍 Activities by continent:');
    const continents = [...new Set(activities.map(a => a.continent))];
    continents.forEach(continent => {
      const count = activities.filter(a => a.continent === continent).length;
      console.log(`   ${continent}: ${count} activities`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    process.exit(1);
  }
}

seedActivities();
