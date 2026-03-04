import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

import mongoose from 'mongoose';
import TravelStory from './src/models/TravelStory.js';
import { connectToDB } from './src/mongodb/index.js';

const travelStories = [
  {
    title: "3 Months Backpacking Through Southeast Asia on $3000",
    author: {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    excerpt: "How I explored Thailand, Vietnam, Cambodia, and Laos on a shoestring budget while staying in hostels, eating street food, and taking overnight buses.",
    content: `
# My Southeast Asia Adventure

After saving for two years, I finally quit my corporate job and bought a one-way ticket to Bangkok. Here's how I made my dream trip happen on just $3000.

## Thailand (3 weeks)
Started in Bangkok's bustling streets, then headed north to Chiang Mai for elephant sanctuaries and cooking classes. The islands in the south were paradise - Koh Tao for diving, Railay Beach for rock climbing.

## Vietnam (5 weeks)
Motorbike journey from Hanoi to Ho Chi Minh City. Ha Long Bay cruise was magical. The food alone is worth the trip - pho, banh mi, fresh spring rolls for under $2.

## Cambodia (3 weeks)
Angkor Wat at sunrise changed my life. Siem Reap was touristy but worth it. Spending time in Phnom Penh taught me so much about Cambodian history and resilience.

## Laos (2 weeks)
Luang Prabang's Buddhist temples and waterfalls were incredibly peaceful. Vang Vieng offered adventure sports. Slow boat down the Mekong was the perfect ending.

## Budget Breakdown
- Accommodation: $600 (hostels, $5-8/night)
- Food: $800 (street food & local restaurants)
- Transport: $600 (buses, trains, flights)
- Activities: $500 (diving, tours, entrance fees)
- Miscellaneous: $500

The key was staying flexible, eating local, taking slow transport, and meeting other travelers to share costs.
    `,
    coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800",
    images: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
      "https://images.unsplash.com/photo-1563492065567-07c44e9ed1e9?w=800"
    ],
    destinations: ["Bangkok, Thailand", "Hanoi, Vietnam", "Siem Reap, Cambodia", "Luang Prabang, Laos"],
    cities: ["Bangkok", "Hanoi", "Siem Reap", "Luang Prabang"],
    countries: ["Thailand", "Vietnam", "Cambodia", "Laos"],
    continents: ["Asia"],
    tripType: "Solo",
    tripDuration: { value: 3, unit: "months" },
    budget: { amount: 3000, currency: "USD" },
    categories: ["Budget", "Backpacking", "Adventure"],
    tags: ["Southeast Asia", "Budget Travel", "Solo Female", "Hostels", "Street Food"],
    tips: [
      "Book hostels through Hostelworld for best deals",
      "Download Grab app for cheap transport",
      "Get SIM cards locally - they're super cheap",
      "Join hostel tours to meet people and save money",
      "Always carry toilet paper and hand sanitizer"
    ],
    highlights: [
      "Watching sunrise at Angkor Wat",
      "Motorbike adventure through Vietnamese highlands",
      "Island hopping in Thailand",
      "Meeting amazing travelers from around the world"
    ],
    challenges: [
      "Food poisoning in Ho Chi Minh City",
      "Overnight bus breakdowns",
      "Language barriers in rural areas",
      "Dealing with loneliness at times"
    ],
    featured: true,
    published: true,
    likes: 1247,
    views: 23456,
    rating: 4.8
  },
  {
    title: "Luxury Safari in Tanzania: A Once-in-a-Lifetime Experience",
    author: {
      name: "James Mitchell",
      email: "james.mitchell@example.com",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    excerpt: "Two weeks in Tanzania's most exclusive safari lodges, witnessing the Great Migration and tracking the Big Five with expert guides.",
    content: `
# The Ultimate African Safari

My wife and I celebrated our 20th anniversary with a luxury safari through Tanzania's Serengeti and Ngorongoro Crater. It exceeded all expectations.

## Our Itinerary

### Serengeti National Park (7 days)
Stayed at Four Seasons Safari Lodge with private game drives twice daily. Witnessed the wildebeest migration - over 1.5 million animals crossing the Mara River. Saw all Big Five within 48 hours.

### Ngorongoro Crater (3 days)
The world's largest inactive volcanic caldera. Descended to the crater floor where we saw black rhinos, lions feasting on a buffalo, and thousands of flamingos.

### Tarangire National Park (2 days)
Famous for elephant herds - we saw over 300 elephants in one day. The baobab trees create an otherworldly landscape.

### Zanzibar (3 days)
Ended with beach relaxation in Stone Town. Spice tour, snorkeling, and fresh seafood.

## What Made It Special
- Private vehicle and expert guide (David) for entire trip
- Bush dinners under the stars
- Hot air balloon safari over Serengeti at sunrise
- Sundowners in the wilderness
- Luxury tented camps with incredible service

## Cost
$18,000 per couple for 2 weeks including:
- Luxury accommodation
- All meals and drinks
- Private guide and vehicle
- Park fees
- International flights (economy)
- Zanzibar extension

Worth every penny for the experience of a lifetime.
    `,
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
      "https://images.unsplash.com/photo-1535338454770-e31cc2b17eef?w=800",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
    ],
    destinations: ["Serengeti, Tanzania", "Ngorongoro, Tanzania", "Zanzibar, Tanzania"],
    cities: ["Serengeti", "Ngorongoro", "Zanzibar"],
    countries: ["Tanzania"],
    continents: ["Africa"],
    tripType: "Couple",
    tripDuration: { value: 2, unit: "weeks" },
    budget: { amount: 18000, currency: "USD" },
    categories: ["Luxury", "Nature"],
    tags: ["Tanzania", "Safari", "Big Five", "Migration", "Anniversary"],
    tips: [
      "Book 6-12 months in advance for best lodges",
      "Bring a good camera with telephoto lens",
      "Pack neutral colored clothing",
      "Bring binoculars - essential for wildlife viewing",
      "Budget extra for hot air balloon safari"
    ],
    highlights: [
      "Witnessing the Great Migration river crossing",
      "Hot air balloon over endless Serengeti plains",
      "Black rhino sighting in Ngorongoro Crater",
      "Bush dinner under African stars",
      "Pride of lions with cubs"
    ],
    challenges: [
      "Very long flights and connections",
      "Expensive compared to other destinations",
      "Limited WiFi connectivity",
      "Early morning wake-ups for game drives"
    ],
    featured: true,
    published: true,
    likes: 892,
    views: 18234,
    rating: 4.9
  },
  {
    title: "Van Life in New Zealand: 6 Months Exploring Both Islands",
    author: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    excerpt: "Living in a converted campervan, I explored New Zealand's stunning landscapes, from fjords to geothermal wonderlands, on my own terms.",
    content: `
# Freedom on Four Wheels

Six months, one campervan, two islands, and countless adventures. Here's my guide to van life in New Zealand.

## The Van Setup
Bought a 2010 Toyota Hiace for NZ$8,000. Converted it myself with:
- Bed platform with storage
- Portable stove and cooler
- Solar panel for charging
- Blackout curtains
- Portable toilet

Sold it for NZ$7,500 at the end - basically free accommodation!

## North Island Highlights
- Bay of Islands: Kayaking and dolphin watching
- Rotorua: Geothermal pools and Maori culture
- Tongariro Crossing: Best day hike of my life
- Wellington: Coffee culture and Te Papa Museum

## South Island Epic Journey
- Abel Tasman: Kayaking and coastal hiking
- West Coast: Fox Glacier and wild beaches
- Queenstown: Bungee jumping and Milford Sound
- Otago: Wine tasting in Central Otago

## Freedom Camping
- Used CamperMate app to find free camping spots
- Stayed at DOC campsites ($6-15/night)
- Occasionally splurged on holiday parks for showers
- Always left spots cleaner than I found them

## Monthly Budget
- Fuel: $400
- Food: $600 (mostly cooked in the van)
- Activities: $300
- Camping: $200
- Total: ~$1,500/month

## Best Activities
1. Milford Sound cruise
2. Tongariro Alpine Crossing
3. Skydiving in Queenstown
4. Swimming with seals in Kaikoura
5. Stargazing in Tekapo

The flexibility to wake up in paradise and change plans on a whim made this unforgettable.
    `,
    coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800",
      "https://images.unsplash.com/photo-1568849676085-51415703900f?w=800"
    ],
    destinations: ["Queenstown, New Zealand", "Rotorua, New Zealand", "Wellington, New Zealand"],
    cities: ["Queenstown", "Rotorua", "Wellington"],
    countries: ["New Zealand"],
    continents: ["Australia"],
    tripType: "Solo",
    tripDuration: { value: 6, unit: "months" },
    budget: { amount: 9000, currency: "USD" },
    categories: ["Road Trip", "Adventure"],
    tags: ["New Zealand", "Van Life", "Freedom Camping", "Hiking", "Adventure"],
    tips: [
      "Buy a van with good service history",
      "Get a self-contained certificate to access more camping spots",
      "Join van life Facebook groups for tips and selling later",
      "Stock up on food in larger cities",
      "Respect camping rules - our privilege depends on it"
    ],
    highlights: [
      "Waking up to ocean views every morning",
      "Milford Sound on a rare clear day",
      "Random conversations with fellow travelers",
      "Completing the Tongariro Crossing",
      "The absolute freedom of van life"
    ],
    challenges: [
      "Finding free camping near popular attractions",
      "Dealing with small living space",
      "Keeping warm in winter",
      "Mechanical issues on the West Coast",
      "Saying goodbye to the lifestyle"
    ],
    featured: true,
    published: true,
    likes: 1534,
    views: 31245,
    rating: 4.7
  },
  {
    title: "Japan in Cherry Blossom Season: A Cultural Immersion",
    author: {
      name: "David Park",
      email: "david.park@example.com",
      avatar: "https://i.pravatar.cc/150?img=13"
    },
    excerpt: "Two weeks experiencing Japan's hanami season, from Tokyo's modern energy to Kyoto's ancient temples, all under blooming sakura trees.",
    content: `
# Sakura Dreams Come True

Timing our Japan trip for cherry blossom season was a dream come true. Here's our journey through pink-petaled perfection.

## Tokyo (5 days)
- Shinjuku Gyoen: Best cherry blossom viewing in the city
- Senso-ji Temple: Ancient meets modern
- Shibuya Crossing: Controlled chaos
- Tsukiji Outer Market: Breakfast sushi
- TeamLab Borderless: Digital art wonderland

## Hakone (2 days)
- Onsen ryokan experience
- Mt. Fuji views with cherry blossoms
- Lake Ashi pirate ship cruise
- Traditional kaiseki dinner

## Kyoto (5 days)
- Philosopher's Path: Cherry blossom tunnel
- Fushimi Inari: 10,000 torii gates
- Arashiyama Bamboo Grove
- Gion district geisha spotting
- Kiyomizu-dera Temple

## Osaka (2 days)
- Osaka Castle surrounded by cherry blossoms
- Dotonbori food paradise
- Street food: takoyaki, okonomiyaki

## Cultural Experiences
- Tea ceremony in Kyoto
- Staying in traditional ryokan
- Sumo wrestling tournament
- Karaoke in Golden Gai
- Hanami picnic in Ueno Park

## Food Journey
Best meals of our lives:
- Sushi breakfast at Tsukiji
- Ramen in Ichiran
- Wagyu beef in Osaka
- Kaiseki dinner at ryokan
- Conveyor belt sushi everywhere

## Practical Tips
- JR Pass saved us hundreds
- Pocket WiFi was essential
- IC card for all transport
- Cash is king in Japan
- Book popular restaurants in advance

Total cost: $5,000 per person for 2 weeks including flights.
    `,
    coverImage: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800"
    ],
    destinations: ["Tokyo, Japan", "Kyoto, Japan", "Osaka, Japan"],
    cities: ["Tokyo", "Kyoto", "Osaka"],
    countries: ["Japan"],
    continents: ["Asia"],
    tripType: "Couple",
    tripDuration: { value: 2, unit: "weeks" },
    budget: { amount: 5000, currency: "USD" },
    categories: ["Cultural", "Food", "Nature"],
    tags: ["Japan", "Cherry Blossoms", "Sakura", "Food", "Culture"],
    tips: [
      "Check sakura forecast before booking",
      "Get JR Pass before arriving",
      "Download Google Translate app",
      "Respect temple and shrine etiquette",
      "Try standing-only ramen shops"
    ],
    highlights: [
      "Philosopher's Path during peak bloom",
      "Ryokan experience with private onsen",
      "Fresh sushi at 7am in Tsukiji",
      "Fushimi Inari at sunrise",
      "Hanami picnic with locals"
    ],
    challenges: [
      "Crowds during peak cherry blossom season",
      "Language barrier outside tourist areas",
      "Expensive accommodation",
      "Overwhelming food choices",
      "Short bloom period requires perfect timing"
    ],
    featured: true,
    published: true,
    likes: 2341,
    views: 45678,
    rating: 4.9
  },
  {
    title: "Iceland Ring Road in Winter: Chasing the Northern Lights",
    author: {
      name: "Sophie Anderson",
      email: "sophie.anderson@example.com",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    excerpt: "10 days driving the Ring Road in February, exploring ice caves, bathing in hot springs, and witnessing the magical Aurora Borealis.",
    content: `
# Fire and Ice Adventure

Winter in Iceland is not for the faint-hearted, but it's when this volcanic island truly shows its magic.

## Route & Stops

### Reykjavik (2 days)
- Hallgrímskirkja church
- Harpa Concert Hall
- Local food scene
- New Year's Eve fireworks

### South Coast (3 days)
- Seljalandsfoss & Skógafoss waterfalls (frozen!)
- Black sand beach at Vík
- Jökulsárlón Glacier Lagoon
- Crystal ice cave tour

### East Fjords (2 days)
- Remote fishing villages
- Dramatic mountain scenery
- Fewer crowds

### North Iceland (2 days)
- Mývatn Nature Baths
- Dettifoss waterfall
- Diamond Circle route

### Snæfellsnes Peninsula (1 day)
- Kirkjufell mountain
- Dramatic coastline
- Return to Reykjavik

## Aurora Hunting
Saw Northern Lights on 7 out of 10 nights! Tips:
- Download Aurora forecast apps
- Drive away from light pollution
- Be patient and dress warmly
- Bring tripod for photos
- KP index of 2+ is usually good enough

## Winter Driving
- Rented 4x4 with studded tires
- Insurance is essential
- Check road conditions daily
- Many roads closed in winter
- Allow extra time for everything

## Budget ($4,500 per person)
- Flights: $600
- Car rental (4x4): $1,200
- Accommodation: $1,400
- Food: $800
- Activities: $500

Iceland is expensive but incredible. Grocery stores save money vs restaurants.

## Best Experiences
1. Ice cave tour
2. Northern Lights dancing overhead
3. Secret Lagoon hot spring
4. Empty landscapes
5. Icelandic horse encounter
    `,
    coverImage: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    images: [
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800"
    ],
    destinations: ["Reykjavik, Iceland", "Vik, Iceland"],
    cities: ["Reykjavik", "Vik"],
    countries: ["Iceland"],
    continents: ["Europe"],
    tripType: "Couple",
    tripDuration: { value: 10, unit: "days" },
    budget: { amount: 4500, currency: "USD" },
    categories: ["Road Trip", "Nature", "Adventure"],
    tags: ["Iceland", "Northern Lights", "Winter Travel", "Ring Road", "Ice Caves"],
    tips: [
      "Rent a 4x4 - essential for winter",
      "Book ice cave tours in advance",
      "Bring warm, waterproof layers",
      "Download offline maps",
      "Fill up gas tank frequently - stations are sparse"
    ],
    highlights: [
      "Seven nights of Northern Lights",
      "Walking inside a glacier ice cave",
      "Empty, snow-covered landscapes",
      "Hot springs in freezing weather",
      "Icelandic kindness and hospitality"
    ],
    challenges: [
      "Extreme weather and short daylight",
      "Expensive everything",
      "Challenging winter driving",
      "Some attractions closed",
      "Cold temperatures (down to -15°C)"
    ],
    featured: false,
    published: true,
    likes: 1087,
    views: 21456,
    rating: 4.8
  },
  {
    title: "Backpacking Patagonia: Torres del Paine Trek",
    author: {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@example.com",
      avatar: "https://i.pravatar.cc/150?img=14"
    },
    excerpt: "Conquering the famous W Trek in Chilean Patagonia - 5 days of stunning glaciers, turquoise lakes, and challenging mountain terrain.",
    content: `
# End of the World Adventure

Torres del Paine National Park in Chilean Patagonia is one of the world's most spectacular trekking destinations. Here's my W Trek experience.

## Preparation
- Month: February (summer in South America)
- Booked refugios 4 months in advance
- Trained with weighted backpack hikes
- High-quality waterproof gear essential

## Day-by-Day Itinerary

### Day 1: Base of Torres (9 hours)
The iconic towers view. 19km round trip with 900m elevation gain. Hardest day but worth every step when those granite towers appeared.

### Day 2: To Los Cuernos (6 hours)
Easier day with stunning views of turquoise Lake Nordenskjöld. Condors soaring overhead.

### Day 3: French Valley (8 hours)
Most beautiful day. Walking into the amphitheater of the French Valley with hanging glaciers all around.

### Day 4: To Glacier Grey (4 hours)
Arriving at Grey Glacier, watching icebergs floating in the lake. Optional ice hiking on the glacier.

### Day 5: Boat to Pudeto (3 hours + boat)
Final morning walk and boat ride across the lake, sad to leave.

## The Challenge
- Weather changes every 30 minutes
- Winds can reach 100+ km/h
- Technical terrain requires good fitness
- Camping not for beginners
- Need to carry full pack

## Cost Breakdown (5 days)
- Park entrance: $40
- Refugio accommodation: $450
- Meals at refugios: $200
- Bus transfers: $60
- Gear rental: $100
Total: ~$850

## Wildlife Spotted
- Guanacos (wild llamas)
- Andean condors
- Grey foxes
- Black-chested buzzard eagles
- Magellanic woodpeckers

## Best Photos
Right at golden hour at the Torres base. Bring a tripod and arrive early!
    `,
    coverImage: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
    images: [
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    ],
    destinations: ["Torres del Paine, Chile"],
    cities: ["Torres del Paine"],
    countries: ["Chile"],
    continents: ["South America"],
    tripType: "Solo",
    tripDuration: { value: 5, unit: "days" },
    budget: { amount: 850, currency: "USD" },
    categories: ["Backpacking", "Adventure", "Nature", "Mountains"],
    tags: ["Patagonia", "Trekking", "W Trek", "Chile", "Hiking"],
    tips: [
      "Book refugios/campings at least 4 months ahead",
      "Bring multiple layers - weather is unpredictable",
      "Trekking poles are essential",
      "Start early for the Torres base hike",
      "Bring high-calorie snacks"
    ],
    highlights: [
      "Sunrise at Torres base",
      "French Valley amphitheater",
      "Watching ice calve off Grey Glacier",
      "Patagonian wind and wild weather",
      "Sense of accomplishment"
    ],
    challenges: [
      "Extreme wind - knocked me over twice",
      "Heavy backpack for days",
      "Expensive for South America",
      "Booking logistics",
      "Physical demands"
    ],
    featured: false,
    published: true,
    likes: 743,
    views: 15234,
    rating: 4.7
  }
];

async function seedTravelStories() {
  try {
    await connectToDB();
    console.log('📚 Starting travel stories seeding...');

    // Clear existing travel stories
    await TravelStory.deleteMany({});
    console.log('✅ Cleared existing travel stories');

    // Insert new travel stories
    const result = await TravelStory.insertMany(travelStories);
    console.log(`✅ Successfully seeded ${result.length} travel stories`);

    console.log('\n📊 Stories by trip type:');
    const tripTypes = [...new Set(travelStories.map(s => s.tripType))];
    tripTypes.forEach(type => {
      const count = travelStories.filter(s => s.tripType === type).length;
      console.log(`   ${type}: ${count} stories`);
    });

    console.log('\n💰 Stories by budget:');
    const budgets = [...new Set(travelStories.map(s => s.budget))];
    budgets.forEach(budget => {
      const count = travelStories.filter(s => s.budget === budget).length;
      console.log(`   ${budget}: ${count} stories`);
    });

    console.log('\n⭐ Featured stories:', travelStories.filter(s => s.featured).length);
    console.log('👁️ Total views:', travelStories.reduce((sum, s) => sum + s.views, 0).toLocaleString());
    console.log('❤️ Total likes:', travelStories.reduce((sum, s) => sum + s.likes, 0).toLocaleString());

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding travel stories:', error);
    process.exit(1);
  }
}

seedTravelStories();
