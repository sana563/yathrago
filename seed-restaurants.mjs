import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

import mongoose from 'mongoose';
import Restaurant from './src/models/Restaurant.js';
import { connectToDB } from './src/mongodb/index.js';

const restaurants = [
  {
    name: "Osteria Francescana",
    description: "Three-Michelin-star restaurant by Chef Massimo Bottura, offering innovative Italian cuisine that reimagines traditional dishes.",
    address: "Via Stella 22",
    city: "Modena",
    country: "Italy",
    continent: "Europe",
    cuisine: ["Italian", "Contemporary", "Fine Dining"],
    priceRange: "Luxury",
    averageCost: { amount: 350, currency: "USD", perPerson: true },
    rating: 4.9,
    reviewCount: 2134,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Lunch", "Dinner"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"],
    features: ["Tasting Menu", "Wine Pairing", "Chef's Table", "Private Dining"],
    tags: ["Michelin Star", "Italian Cuisine", "Celebrity Chef", "Reservations Essential"],
    openingHours: "Tue-Sat: 12:30-14:30, 19:30-22:30",
    reservationRequired: true,
    website: "https://www.osteriafrancescana.it",
    phone: "+39-059-223-912",
    coordinates: { latitude: 44.6469, longitude: 10.9258 },
    specialties: ["Five Ages of Parmigiano Reggiano", "Oops! I Dropped the Lemon Tart"]
  },
  {
    name: "Sukiyabashi Jiro",
    description: "Legendary 3-Michelin-star sushi restaurant run by 96-year-old Jiro Ono, featured in 'Jiro Dreams of Sushi' documentary.",
    address: "Tsukamoto Sogyo Building B1F, 2-15 Ginza 4-chome",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    cuisine: ["Japanese", "Sushi", "Seafood"],
    priceRange: "Luxury",
    averageCost: { amount: 400, currency: "USD", perPerson: true },
    rating: 4.9,
    reviewCount: 1876,
    images: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Lunch", "Dinner"],
    dietaryOptions: [],
    features: ["Omakase", "Counter Seating", "Traditional"],
    tags: ["Michelin Star", "Sushi Master", "Documentary Famous", "Ultra Exclusive"],
    openingHours: "Mon-Sat: 11:30-14:00, 17:30-20:30",
    reservationRequired: true,
    phone: "+81-3-3535-3600",
    coordinates: { latitude: 35.6719, longitude: 139.7638 },
    specialties: ["Omakase Sushi Course", "Aged Tuna", "Sea Urchin"]
  },
  {
    name: "Noma",
    description: "Revolutionary Nordic restaurant with 3 Michelin stars, pioneering New Nordic cuisine using foraged ingredients and fermentation.",
    address: "Refshalevej 96",
    city: "Copenhagen",
    country: "Denmark",
    continent: "Europe",
    cuisine: ["Nordic", "Scandinavian", "Contemporary"],
    priceRange: "Luxury",
    averageCost: { amount: 450, currency: "USD", perPerson: true },
    rating: 4.8,
    reviewCount: 3421,
    images: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Dinner"],
    dietaryOptions: ["Vegetarian"],
    features: ["Tasting Menu", "Wine Pairing", "Foraged Ingredients", "Test Kitchen"],
    tags: ["Michelin Star", "New Nordic", "Best Restaurant", "Innovative"],
    openingHours: "Wed-Sat: 18:00-00:00",
    reservationRequired: true,
    website: "https://www.noma.dk",
    phone: "+45-32-96-32-97",
    coordinates: { latitude: 55.7046, longitude: 12.6014 },
    specialties: ["Seasonal Tasting Menu", "Fermented Dishes", "Wild game"]
  },
  {
    name: "Tacos El Gordo",
    description: "Authentic Tijuana-style taco stand serving adobada, carne asada, and lengua tacos in a casual street food atmosphere.",
    address: "689 Las Vegas Blvd S",
    city: "Las Vegas",
    country: "United States",
    continent: "North America",
    cuisine: ["Mexican", "Street Food", "Tacos"],
    priceRange: "Budget",
    averageCost: { amount: 15, currency: "USD", perPerson: true },
    rating: 4.6,
    reviewCount: 8932,
    images: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800"
    ],
    restaurantType: "Street Food",
    mealTypes: ["Lunch", "Dinner", "Late Night"],
    dietaryOptions: [],
    features: ["Open Late", "Quick Service", "Authentic", "Cash Only"],
    tags: ["Street Food", "Tacos", "Local Favorite", "Budget Friendly"],
    openingHours: "Daily: 10:00-03:00",
    reservationRequired: false,
    phone: "+1-702-641-8228",
    coordinates: { latitude: 36.1699, longitude: -115.1398 },
    specialties: ["Adobada Taco", "Mulitas", "Vampiros"]
  },
  {
    name: "Hawker Chan",
    description: "World's cheapest Michelin-starred meal! Famous for soy sauce chicken rice at just $2, voted best street food in Singapore.",
    address: "335 Smith Street #02-126",
    city: "Singapore",
    country: "Singapore",
    continent: "Asia",
    cuisine: ["Chinese", "Singaporean", "Street Food"],
    priceRange: "Budget",
    averageCost: { amount: 8, currency: "USD", perPerson: true },
    rating: 4.4,
    reviewCount: 15234,
    images: [
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
      "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800"
    ],
    restaurantType: "Street Food",
    mealTypes: ["Breakfast", "Lunch", "Dinner"],
    dietaryOptions: [],
    features: ["Hawker Center", "Quick Service", "Takeaway"],
    tags: ["Michelin Star", "Street Food", "Budget", "Famous"],
    openingHours: "Daily: 10:30-19:30",
    reservationRequired: false,
    phone: "+65-6224-4531",
    coordinates: { latitude: 1.2815, longitude: 103.8430 },
    specialties: ["Soy Sauce Chicken Rice", "Char Siew Rice", "Roasted Pork"]
  },
  {
    name: "Le Bernardin",
    description: "Elegant 3-Michelin-star seafood restaurant by Chef Eric Ripert, known for impeccably fresh fish and refined French technique.",
    address: "155 W 51st Street",
    city: "New York",
    country: "United States",
    continent: "North America",
    cuisine: ["French", "Seafood", "Contemporary"],
    priceRange: "Luxury",
    averageCost: { amount: 320, currency: "USD", perPerson: true },
    rating: 4.8,
    reviewCount: 4567,
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
      "https://images.unsplash.com/photo-1615200736914-a1e2f37ec610?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Lunch", "Dinner"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"],
    features: ["Tasting Menu", "Wine Cellar", "Private Dining", "Chef's Table"],
    tags: ["Michelin Star", "Seafood", "French Cuisine", "Elegant"],
    openingHours: "Mon-Thu: 12:00-14:30, 17:15-22:30; Fri-Sat: 12:00-14:30, 17:15-23:00",
    reservationRequired: true,
    website: "https://www.le-bernardin.com",
    phone: "+1-212-554-1515",
    coordinates: { latitude: 40.7614, longitude: -73.9776 },
    specialties: ["Tuna", "Lobster", "Halibut", "Sea Urchin"]
  },
  {
    name: "Asador Etxebarri",
    description: "Smoke and fire-focused restaurant in Basque Country, grilling everything from vegetables to seafood over custom wood fires.",
    address: "Plaza San Juan 1",
    city: "Atxondo",
    country: "Spain",
    continent: "Europe",
    cuisine: ["Spanish", "Basque", "Grilled"],
    priceRange: "Luxury",
    averageCost: { amount: 280, currency: "USD", perPerson: true },
    rating: 4.9,
    reviewCount: 1923,
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      "https://images.unsplash.com/photo-1626794084845-86c39bfbc0b6?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Lunch", "Dinner"],
    dietaryOptions: ["Gluten-Free"],
    features: ["Charcoal Grill", "Tasting Menu", "Wine Pairing", "Seasonal Menu"],
    tags: ["Michelin Star", "Grill Master", "Basque", "Unique Technique"],
    openingHours: "Thu-Mon: 13:00-15:30, 20:30-22:30",
    reservationRequired: true,
    phone: "+34-946-58-30-42",
    coordinates: { latitude: 43.1096, longitude: -2.6426 },
    specialties: ["Grilled Seafood", "Milk-Fed Lamb", "Smoked Caviar"]
  },
  {
    name: "Café Pushkin",
    description: "Opulent 19th-century Russian mansion serving traditional Russian cuisine in an elegant library setting with live piano music.",
    address: "Tverskoy Boulevard 26A",
    city: "Moscow",
    country: "Russia",
    continent: "Europe",
    cuisine: ["Russian", "European"],
    priceRange: "Fine Dining",
    averageCost: { amount: 85, currency: "USD", perPerson: true },
    rating: 4.7,
    reviewCount: 3421,
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
    ],
    restaurantType: "Restaurant",
    mealTypes: ["Breakfast", "Lunch", "Dinner"],
    dietaryOptions: ["Vegetarian"],
    features: ["Live Music", "Library Setting", "Historic Building", "Afternoon Tea"],
    tags: ["Russian Cuisine", "Elegant", "Historic", "Cultural Experience"],
    openingHours: "Daily: 08:00-00:00",
    reservationRequired: true,
    website: "https://www.cafe-pushkin.ru",
    phone: "+7-495-739-00-33",
    coordinates: { latitude: 55.7655, longitude: 37.6043 },
    specialties: ["Beef Stroganoff", "Borscht", "Blini", "Pelmeni"]
  },
  {
    name: "Gaggan Anand",
    description: "Progressive Indian cuisine using molecular gastronomy, ranked Asia's Best Restaurant multiple times with playful emoji menu.",
    address: "68/1 Soi Langsuan",
    city: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    cuisine: ["Indian", "Contemporary", "Fusion"],
    priceRange: "Luxury",
    averageCost: { amount: 180, currency: "USD", perPerson: true },
    rating: 4.8,
    reviewCount: 2876,
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Dinner"],
    dietaryOptions: ["Vegetarian"],
    features: ["Tasting Menu", "Molecular Gastronomy", "Emoji Menu", "Chef Interaction"],
    tags: ["Best Restaurant Asia", "Innovative", "Indian Fusion", "Unique Experience"],
    openingHours: "Tue-Sun: 18:00-23:00",
    reservationRequired: true,
    website: "https://www.gaggan.com",
    phone: "+66-2-652-1700",
    coordinates: { latitude: 13.7413, longitude: 100.5476 },
    specialties: ["Yogurt Explosion", "Charcoal", "The Lick", "Emoji Dishes"]
  },
  {
    name: "Pujol",
    description: "Celebrated Mexican restaurant reinterpreting traditional recipes with modern techniques, featuring the famous mole madre aged 2000+ days.",
    address: "Tennyson 133",
    city: "Mexico City",
    country: "Mexico",
    continent: "North America",
    cuisine: ["Mexican", "Contemporary"],
    priceRange: "Fine Dining",
    averageCost: { amount: 120, currency: "USD", perPerson: true },
    rating: 4.8,
    reviewCount: 3654,
    images: [
      "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800",
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800"
    ],
    restaurantType: "Fine Dining",
    mealTypes: ["Lunch", "Dinner"],
    dietaryOptions: ["Vegetarian", "Gluten-Free"],
    features: ["Tasting Menu", "Mexican Wine", "Contemporary Plating"],
    tags: ["Mexican Cuisine", "Top Restaurant", "Mole", "Modern Mexican"],
    openingHours: "Mon-Sat: 13:30-16:30, 19:00-22:30",
    reservationRequired: true,
    website: "https://www.pujol.com.mx",
    phone: "+52-55-5545-3507",
    coordinates: { latitude: 19.4220, longitude: -99.1930 },
    specialties: ["Mole Madre", "Baby Corn", "Octopus Tacos"]
  }
];

async function seedRestaurants() {
  try {
    await connectToDB();
    console.log('🍽️ Starting restaurants seeding...');

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('✅ Cleared existing restaurants');

    // Insert new restaurants
    const result = await Restaurant.insertMany(restaurants);
    console.log(`✅ Successfully seeded ${result.length} restaurants`);

    console.log('\n📊 Restaurants by cuisine:');
    const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine))];
    cuisines.slice(0, 10).forEach(cuisine => {
      const count = restaurants.filter(r => r.cuisine.includes(cuisine)).length;
      console.log(`   ${cuisine}: ${count} restaurants`);
    });

    console.log('\n💰 Restaurants by price range:');
    const priceRanges = [...new Set(restaurants.map(r => r.priceRange))];
    priceRanges.forEach(range => {
      const count = restaurants.filter(r => r.priceRange === range).length;
      console.log(`   ${range}: ${count} restaurants`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    process.exit(1);
  }
}

seedRestaurants();
