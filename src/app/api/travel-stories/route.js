import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import TravelStory from "@/models/TravelStory";

export async function GET(req) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const tripType = searchParams.get("tripType");
    const rating = searchParams.get("rating");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const sortBy = searchParams.get("sortBy") || "latest";
    
    let filter = { published: true };
    
    // Text search across multiple fields
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Filter by country
    if (country) filter.countries = { $in: [country] };
    
    // Filter by category
    if (category) filter.categories = { $in: [category] };
    
    // Filter by trip type
    if (tripType) filter.tripType = tripType;
    
    // Filter by minimum rating
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    
    // Filter featured stories
    if (featured === 'true') filter.featured = true;
    
    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'latest':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { views: -1, likes: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'likes':
        sort = { likes: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    const stories = await TravelStory.find(filter)
      .sort(sort)
      .limit(limit)
      .select('-comments') // Exclude comments from list view
      .lean();
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching travel stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel stories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json();
    const story = await TravelStory.create(body);
    
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating travel story:", error);
    return NextResponse.json(
      { error: "Failed to create travel story" },
      { status: 500 }
    );
  }
}
