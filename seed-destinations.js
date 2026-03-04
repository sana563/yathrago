const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI_OLD || 'mongodb://localhost:27017/travel';

const destinations = [
    {
        name: "Paris, France",
        details: "The City of Light, famous for its art, fashion, gastronomy and culture. Home to the iconic Eiffel Tower and world-class museums.",
        whatToDo: [
            "Visit the Louvre Museum",
            "Climb the Eiffel Tower",
            "Walk through Montmartre",
            "Take a Seine River cruise",
            "Visit Notre Dame Cathedral"
        ],
        packingList: [
            "Stylish walking shoes",
            "Universal power adapter",
            "Beret (optional but fun!)",
            "Light jacket for evenings",
            "Reusable water bottle"
        ],
        category: "Things to Do",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
    },
    {
        name: "Tokyo, Japan",
        details: "A bustling metropolis where neon-lit skyscrapers meet historic temples. Known for its incredible food, efficient transport, and unique culture.",
        whatToDo: [
            "Explore Shibuya Crossing",
            "Visit Senso-ji Temple in Asakusa",
            "Eat sushi at Tsukiji Outer Market",
            "Visit Shinjuku Gyoen National Garden",
            "Experience Harajuku fashion"
        ],
        packingList: [
            "Portable Wi-Fi or local SIM",
            "Slip-on shoes for temple visits",
            "Hand sanitizer",
            "Coin purse for Yen coins",
            "Comfortable sneakers"
        ],
        category: "Things to Do",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"
    },
    {
        name: "Bali, Indonesia",
        details: "Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
        whatToDo: [
            "Visit Ubud Monkey Forest",
            "Watch the Kecak Fire Dance",
            "Surfing at Kuta Beach",
            "Sunrise trek at Mount Batur",
            "Relax in Seminyak beach clubs"
        ],
        packingList: [
            "Swimwear",
            "Sunscreen and bug spray",
            "Breathable linen clothes",
            "Sarong for temple visits",
            "Dry bag for boat trips"
        ],
        category: "Travel Stories",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
    },
    {
        name: "Santorini, Greece",
        details: "One of the Cyclades islands in the Aegean Sea. Known for its white-washed buildings with blue domes and stunning sunsets over the caldera.",
        whatToDo: [
            "Watch the sunset in Oia",
            "Hike from Fira to Oia",
            "Visit Akrotiri archaeological site",
            "Swim at Red Beach",
            "Wine tasting at local vineyards"
        ],
        packingList: [
            "Polarized sunglasses",
            "Sun hat",
            "Sandals with good grip",
            "White/Blue outfits for photos",
            "Swimsuit"
        ],
        category: "Hotels",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
    },
    {
        name: "New York City, USA",
        details: "The Big Apple – a global hub of culture, finance, and entertainment. From Broadway to Central Park, there's never a dull moment.",
        whatToDo: [
            "Walk through Central Park",
            "Visit Times Square",
            "See a Broadway show",
            "Explore the Metropolitan Museum of Art",
            "Walk the High Line"
        ],
        packingList: [
            "Subway map app",
            "Layers for changing weather",
            "Comfortable walking boots",
            "Reusable shopping bag",
            "Portable charger"
        ],
        category: "Things to Do",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"
    },
    {
        name: "Amalfi Coast, Italy",
        details: "A 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula, in the Campania region.",
        whatToDo: [
            "Drive the coastal road",
            "Visit Positano and Amalfi towns",
            "Take a boat to Capri",
            "Hike the Path of the Gods",
            "Try local Limoncello"
        ],
        packingList: [
            "Motion sickness pills (for curvy roads)",
            "Elegant dinner attire",
            "Comfortable flats for stairs",
            "Swimsuit",
            "Camera with wide lens"
        ],
        category: "Restaurants",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077"
    }
];

// Define Schema here to avoid dependency issues in script
const DestinationSchema = new mongoose.Schema({
    name: String,
    details: String,
    whatToDo: [String],
    packingList: [String],
    image: String,
    category: String,
}, { timestamps: true });

const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

async function seedDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            dbName: 'travel_users',
        });
        console.log('Connected!');

        // Clear existing destinations
        console.log('Clearing existing destinations...');
        await Destination.deleteMany({});

        // Insert new destinations
        console.log('Inserting destinations...');
        await Destination.insertMany(destinations);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
}

seedDB();
