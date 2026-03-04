import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

import mongoose from 'mongoose';
import Hotel from './src/models/Hotel.js';
import { connectToDB } from './src/mongodb/index.js';

const hotels = [
  {
    name: "The Plaza Hotel New York",
    description: "Iconic luxury hotel in Manhattan offering elegant rooms, fine dining, and world-class service since 1907. Located steps from Central Park.",
    address: "768 5th Avenue",
    city: "New York",
    country: "United States",
    continent: "North America",
    priceRange: "Ultra-Luxury",
    pricePerNight: { min: 595, max: 2500, currency: "USD" },
    rating: 4.7,
    reviewCount: 8542,
    amenities: ["Free WiFi", "Spa", "Pool", "Gym", "Restaurant", "Bar", "Room Service", "Concierge", "Valet Parking"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    hotelType: "Hotel",
    tags: ["Luxury", "Historic", "Central Location", "Pet Friendly"],
    website: "https://www.theplazany.com",
    phone: "+1-212-759-3000",
    coordinates: { latitude: 40.7643, longitude: -73.9744 }
  },
  {
    name: "Marina Bay Sands",
    description: "Spectacular resort with iconic rooftop infinity pool, casino, shopping, and stunning views of Singapore's skyline.",
    address: "10 Bayfront Avenue",
    city: "Singapore",
    country: "Singapore",
    continent: "Asia",
    priceRange: "Luxury",
    pricePerNight: { min: 400, max: 1800, currency: "USD" },
    rating: 4.6,
    reviewCount: 12389,
    amenities: ["Infinity Pool", "Casino", "Shopping Mall", "Free WiFi", "Spa", "Multiple Restaurants", "Gym", "Business Center"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
    ],
    hotelType: "Resort",
    tags: ["Iconic", "Rooftop Pool", "Casino", "Shopping"],
    website: "https://www.marinabaysands.com",
    phone: "+65-6688-8868",
    coordinates: { latitude: 1.2834, longitude: 103.8607 }
  },
  {
    name: "Riad Yasmine Marrakech",
    description: "Traditional Moroccan riad in the heart of the medina, featuring beautiful courtyard, rooftop terrace, and authentic hospitality.",
    address: "92 Derb Sidi Ahmed Soussi",
    city: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    priceRange: "Mid-range",
    pricePerNight: { min: 85, max: 180, currency: "USD" },
    rating: 4.8,
    reviewCount: 1247,
    amenities: ["Free WiFi", "Rooftop Terrace", "Traditional Hammam", "Complimentary Breakfast", "Airport Transfer"],
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"
    ],
    hotelType: "Guesthouse",
    tags: ["Authentic", "Boutique", "Medina Location", "Cultural Experience"],
    phone: "+212-524-383-868",
    coordinates: { latitude: 31.6295, longitude: -7.9811 }
  },
  {
    name: "Capsule Hotel Transit Tokyo",
    description: "Modern capsule hotel near Haneda Airport offering compact, efficient accommodations with shared facilities and Japanese technology.",
    address: "2-6-3 Haneda Airport",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    priceRange: "Budget",
    pricePerNight: { min: 45, max: 75, currency: "USD" },
    rating: 4.2,
    reviewCount: 3456,
    amenities: ["Free WiFi", "Shared Lounge", "Luggage Storage", "Vending Machines", "Shower Facilities"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
    ],
    hotelType: "Hostel",
    tags: ["Budget Friendly", "Airport Proximity", "Modern", "Unique Experience"],
    phone: "+81-3-5757-8877",
    coordinates: { latitude: 35.5494, longitude: 139.7798 }
  },
  {
    name: "Hotel Negresco Nice",
    description: "Belle Époque palace on the Promenade des Anglais, combining art, history, and luxury on the French Riviera.",
    address: "37 Promenade des Anglais",
    city: "Nice",
    country: "France",
    continent: "Europe",
    priceRange: "Luxury",
    pricePerNight: { min: 350, max: 1200, currency: "USD" },
    rating: 4.5,
    reviewCount: 4521,
    amenities: ["Private Beach", "Michelin-Star Restaurant", "Spa", "Free WiFi", "Bar", "Concierge", "Room Service"],
    images: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    hotelType: "Hotel",
    tags: ["Historic", "Beachfront", "Art Collection", "Fine Dining"],
    website: "https://www.hotel-negresco-nice.com",
    phone: "+33-4-93-16-64-00",
    coordinates: { latitude: 43.6951, longitude: 7.2578 }
  },
  {
    name: "Burj Al Arab Jumeirah",
    description: "World's most luxurious hotel, featuring all-suite accommodations, private butler service, and unparalleled opulence in Dubai.",
    address: "Jumeirah Street",
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    priceRange: "Ultra-Luxury",
    pricePerNight: { min: 1800, max: 15000, currency: "USD" },
    rating: 4.9,
    reviewCount: 6789,
    amenities: ["Private Beach", "Infinity Pool", "Helicopter Landing", "Butler Service", "Chauffeur", "Multiple Restaurants", "Spa", "Private Beach"],
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    hotelType: "Hotel",
    tags: ["Ultra Luxury", "Iconic", "All Suites", "Butler Service"],
    website: "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah",
    phone: "+971-4-301-7777",
    coordinates: { latitude: 25.1412, longitude: 55.1853 }
  },
  {
    name: "Selina Hostel Santa Teresa",
    description: "Boutique hostel in Rio's artistic neighborhood, perfect for backpackers and digital nomads seeking community and culture.",
    address: "Rua Almirante Alexandrino, 660",
    city: "Rio de Janeiro",
    country: "Brazil",
    continent: "South America",
    priceRange: "Budget",
    pricePerNight: { min: 25, max: 90, currency: "USD" },
    rating: 4.3,
    reviewCount: 2134,
    amenities: ["Free WiFi", "Co-working Space", "Bar", "Shared Kitchen", "Terrace", "Tours", "Events"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1587213811864-571734cb6293?w=800"
    ],
    hotelType: "Hostel",
    tags: ["Backpackers", "Social", "Digital Nomad Friendly", "Artistic Area"],
    website: "https://www.selina.com",
    phone: "+55-21-2221-0098",
    coordinates: { latitude: -22.9153, longitude: -43.1844 }
  },
  {
    name: "Frangipani Villa Hotel Siem Reap",
    description: "Charming boutique hotel near Angkor Wat temples, offering traditional Khmer hospitality and lush tropical gardens.",
    address: "Wat Bo Village",
    city: "Siem Reap",
    country: "Cambodia",
    continent: "Asia",
    priceRange: "Mid-range",
    pricePerNight: { min: 65, max: 145, currency: "USD" },
    rating: 4.7,
    reviewCount: 1876,
    amenities: ["Outdoor Pool", "Free WiFi", "Restaurant", "Spa", "Bike Rental", "Complimentary Breakfast", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1587874522232-f2e291c0f0e8?w=800"
    ],
    hotelType: "Villa",
    tags: ["Boutique", "Near Temples", "Tropical Garden", "Authentic"],
    phone: "+855-63-964-391",
    coordinates: { latitude: 13.3622, longitude: 103.8597 }
  },
  {
    name: "The Savoy London",
    description: "Legendary luxury hotel on the Thames, offering timeless elegance, exceptional service, and iconic afternoon tea since 1889.",
    address: "Strand",
    city: "London",
    country: "United Kingdom",
    continent: "Europe",
    priceRange: "Luxury",
    pricePerNight: { min: 450, max: 2000, currency: "USD" },
    rating: 4.6,
    reviewCount: 7234,
    amenities: ["Pool", "Spa", "Multiple Restaurants", "Bar", "Gym", "Butler Service", "Free WiFi", "Thames Views"],
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    hotelType: "Hotel",
    tags: ["Historic", "Luxury", "River Views", "Afternoon Tea"],
    website: "https://www.thesavoylondon.com",
    phone: "+44-20-7836-4343",
    coordinates: { latitude: 51.5104, longitude: -0.1206 }
  },
  {
    name: "Zanzibar Beach Resort",
    description: "Beachfront paradise with white sand beaches, turquoise waters, and traditional Swahili architecture on Zanzibar's coast.",
    address: "Nungwi Beach",
    city: "Zanzibar",
    country: "Tanzania",
    continent: "Africa",
    priceRange: "Mid-range",
    pricePerNight: { min: 120, max: 280, currency: "USD" },
    rating: 4.5,
    reviewCount: 1623,
    amenities: ["Private Beach", "Pool", "Diving Center", "Restaurant", "Bar", "Spa", "Water Sports", "Free WiFi"],
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    hotelType: "Resort",
    tags: ["Beach", "Diving", "Tropical", "Romantic"],
    phone: "+255-777-123-456",
    coordinates: { latitude: -6.161184, longitude: 39.199849 }
  }
];

async function seedHotels() {
  try {
    await connectToDB();
    console.log('🏨 Starting hotel seeding...');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('✅ Cleared existing hotels');

    // Insert new hotels
    const result = await Hotel.insertMany(hotels);
    console.log(`✅ Successfully seeded ${result.length} hotels`);

    console.log('\n📊 Hotels by continent:');
    const continents = [...new Set(hotels.map(h => h.continent))];
    continents.forEach(continent => {
      const count = hotels.filter(h => h.continent === continent).length;
      console.log(`   ${continent}: ${count} hotels`);
    });

    console.log('\n💰 Hotels by price range:');
    const priceRanges = [...new Set(hotels.map(h => h.priceRange))];
    priceRanges.forEach(range => {
      const count = hotels.filter(h => h.priceRange === range).length;
      console.log(`   ${range}: ${count} hotels`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding hotels:', error);
    process.exit(1);
  }
}

seedHotels();
