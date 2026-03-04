import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Activity from "@/models/Activity";

export async function GET(req) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const priceRange = searchParams.get("priceRange");
    const rating = searchParams.get("rating");
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
    
    // Filter by category
    if (category) filter.category = category;
    
    // Filter by difficulty
    if (difficulty) filter.difficulty = difficulty;
    
    // Filter by price range
    if (priceRange) filter.priceRange = priceRange;
    
    // Filter by minimum rating
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    
    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'price-low':
        sort = { 'price.amount': 1 };
        break;
      case 'price-high':
        sort = { 'price.amount': -1 };
        break;
      case 'duration':
        sort = { 'duration.value': 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { rating: -1 };
    }
    
    const activities = await Activity.find(filter)
      .sort(sort)
      .limit(limit)
      .lean();
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json();
    const activity = await Activity.create(body);
    
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
