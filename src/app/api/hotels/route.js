import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Hotel from "@/models/Hotel";

export async function GET(req) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const priceRange = searchParams.get("priceRange");
    const rating = searchParams.get("rating");
    const hotelType = searchParams.get("hotelType");
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
    
    // Filter by price range
    if (priceRange) filter.priceRange = priceRange;
    
    // Filter by minimum rating
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    
    // Filter by hotel type
    if (hotelType) filter.hotelType = hotelType;
    
    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'price-low':
        sort = { 'pricePerNight.min': 1 };
        break;
      case 'price-high':
        sort = { 'pricePerNight.max': -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { rating: -1 };
    }
    
    const hotels = await Hotel.find(filter)
      .sort(sort)
      .limit(limit)
      .lean();
    
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json();
    const hotel = await Hotel.create(body);
    
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel:", error);
    return NextResponse.json(
      { error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
