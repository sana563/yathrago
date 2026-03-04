import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Restaurant from "@/models/Restaurant";

export async function GET(req) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const cuisine = searchParams.get("cuisine");
    const priceRange = searchParams.get("priceRange");
    const rating = searchParams.get("rating");
    const restaurantType = searchParams.get("restaurantType");
    const dietaryOptions = searchParams.get("dietaryOptions");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const sortBy = searchParams.get("sortBy") || "rating";
    
    let filter = {};
    
    // Text search across multiple fields
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Filter by location
    if (city) filter.city = new RegExp(city, 'i');
    if (country) filter.country = new RegExp(country, 'i');
    
    // Filter by cuisine
    if (cuisine) filter.cuisine = { $in: [cuisine] };
    
    // Filter by price range
    if (priceRange) filter.priceRange = priceRange;
    
    // Filter by minimum rating
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    
    // Filter by restaurant type
    if (restaurantType) filter.restaurantType = restaurantType;
    
    // Filter by dietary options
    if (dietaryOptions) filter.dietaryOptions = { $in: [dietaryOptions] };
    
    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'price-low':
        sort = { 'averageCost.amount': 1 };
        break;
      case 'price-high':
        sort = { 'averageCost.amount': -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { rating: -1 };
    }
    
    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .limit(limit)
      .lean();
    
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json();
    const restaurant = await Restaurant.create(body);
    
    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}
