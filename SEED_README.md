# Seed Scripts

This directory contains seed scripts to populate your database with sample travel data.

## Available Seed Scripts

### Individual Scripts
- `npm run seed:hotels` - Seeds 10 hotels across different continents and price ranges
- `npm run seed:activities` - Seeds 10 diverse activities (adventure, cultural, nature, food, etc.)
- `npm run seed:restaurants` - Seeds 10 restaurants from street food to Michelin-starred
- `npm run seed:stories` - Seeds 6 comprehensive travel blog stories

### All-in-One
- `npm run seed:all` - Runs all seed scripts in sequence

## What's Included

### Hotels (10 entries)
- **Luxury**: Plaza Hotel New York, Marina Bay Sands, Burj Al Arab, The Savoy London
- **Mid-range**: Riad Yasmine Marrakech, Frangipani Villa Siem Reap, Zanzibar Beach Resort
- **Budget**: Capsule Hotel Tokyo, Selina Hostel Rio

### Activities (10 entries)
- **Adventure**: Skydiving Dubai, Machu Picchu Trek, Hot Air Balloon Cappadocia
- **Nature**: Northern Lights Safari, Great Barrier Reef Snorkeling, Safari Game Drive
- **Cultural**: Louvre Museum Tour, Tokyo Food Tour
- **Wellness**: Bali Yoga Retreat
- **Entertainment**: Broadway Show

### Restaurants (10 entries)
- **Michelin-Starred**: Osteria Francescana, Sukiyabashi Jiro, Noma, Le Bernardin
- **Street Food**: Tacos El Gordo, Hawker Chan (world's cheapest Michelin meal)
- **Fine Dining**: Asador Etxebarri, Gaggan Anand, Pujol
- **Traditional**: Café Pushkin

### Travel Stories (6 entries)
1. **3 Months Backpacking Southeast Asia** - Budget travel through Thailand, Vietnam, Cambodia, Laos ($3000)
2. **Luxury Safari in Tanzania** - 2-week Big Five safari experience ($18,000/couple)
3. **Van Life in New Zealand** - 6 months exploring both islands in a converted campervan
4. **Japan Cherry Blossom Season** - 2-week cultural immersion during hanami
5. **Iceland Ring Road in Winter** - 10 days chasing Northern Lights
6. **Patagonia W Trek** - 5-day challenging hiking adventure

## Features

### Real Images
All entries use high-quality images from Unsplash with relevant, themed photography.

### Comprehensive Data
- Full address and GPS coordinates
- Realistic pricing in USD
- Detailed descriptions
- Reviews and ratings
- Tags and categories
- Amenities and features
- Booking information

### Geographic Diversity
Content spans all continents:
- Asia: Japan, Singapore, Thailand, UAE, Turkey, Indonesia
- Europe: France, Italy, UK, Denmark, Spain, Russia, Norway, Iceland
- Africa: Tanzania, Morocco
- North America: USA, Mexico
- South America: Peru, Chile, Brazil
- Australia: New Zealand, Australia

### Search-Ready
All entries include text-searchable fields and are indexed for MongoDB full-text search.

## Usage

1. **Ensure MongoDB is running** and your `.env` file has the correct `MONGODB_URI`

2. **Run the seed script(s)**:
   ```bash
   npm run seed:all
   ```

3. **Check the output** - You should see success messages and statistics

4. **Visit your app**:
   - http://localhost:3000/trip-advisor - Browse hotels, activities, restaurants
   - http://localhost:3000/discover - Read travel stories
   - http://localhost:3000 - Use search functionality

## Notes

- ⚠️ **Warning**: Seed scripts will **delete all existing data** in the collections before inserting new data
- Each script can be run independently if you only want to seed specific content
- All scripts are idempotent - safe to run multiple times
- View counts and likes are static in seed data but will update in production

## Extending the Data

To add more seed data:

1. Edit the individual seed files (`seed-hotels.mjs`, `seed-activities.mjs`, etc.)
2. Add new objects to the arrays following the same schema structure
3. Re-run the seed script for that collection

## Image Sources

- All images are sourced from Unsplash (https://unsplash.com)
- Images are free to use under Unsplash License
- Replace with your own images for production use

---

**Happy seeding! 🌱**
