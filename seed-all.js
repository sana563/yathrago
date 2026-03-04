import mongoose from 'mongoose';
import Hotel from './src/models/Hotel.js';
import Activity from './src/models/Activity.js';
import Restaurant from './src/models/Restaurant.js';
import TravelStory from './src/models/TravelStory.js';
import { connectToDB } from './src/mongodb/index.js';

// Import seed data
import { hotels } from './seed-data/hotels.js';
import { activities } from './seed-data/activities.js';
import { restaurants } from './seed-data/restaurants.js';
import { travelStories } from './seed-data/travel-stories.js';

async function seedAll() {
  try {
    console.log('🚀 Starting complete database seeding...\n');
    await connectToDB();

    // Clear all collections
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Hotel.deleteMany({}),
      Activity.deleteMany({}),
      Restaurant.deleteMany({}),
      TravelStory.deleteMany({})
    ]);
    console.log('✅ All collections cleared\n');

    // Seed all data
    console.log('📥 Inserting new data...');
    
    const [hotelResults, activityResults, restaurantResults, storyResults] = await Promise.all([
      Hotel.insertMany(hotels),
      Activity.insertMany(activities),
      Restaurant.insertMany(restaurants),
      TravelStory.insertMany(travelStories)
    ]);

    console.log('\n✅ Database seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   🏨 Hotels: ${hotelResults.length}`);
    console.log(`   🎭 Activities: ${activityResults.length}`);
    console.log(`   🍽️  Restaurants: ${restaurantResults.length}`);
    console.log(`   📚 Travel Stories: ${storyResults.length}`);
    console.log(`   📝 Total documents: ${hotelResults.length + activityResults.length + restaurantResults.length + storyResults.length}`);

    // Additional statistics
    console.log('\n🌍 Geographic Distribution:');
    const allItems = [...hotels, ...activities, ...restaurants];
    const continents = [...new Set(allItems.map(item => item.continent))];
    continents.forEach(continent => {
      const count = allItems.filter(item => item.continent === continent).length;
      console.log(`   ${continent}: ${count} items`);
    });

    console.log('\n💡 Tips:');
    console.log('   • Visit http://localhost:3000/trip-advisor to browse all content');
    console.log('   • Visit http://localhost:3000/discover to search destinations');
    console.log('   • Use the search bar to find specific locations or activities');

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('🎉 All done! Your database is ready to use.\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedAll();
