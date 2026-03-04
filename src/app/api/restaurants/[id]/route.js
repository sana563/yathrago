import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Restaurant from "@/models/Restaurant";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const restaurant = await Restaurant.findById(id).lean();
    
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await req.json();
    
    const restaurant = await Restaurant.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to update restaurant" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { error: "Failed to delete restaurant" },
      { status: 500 }
    );
  }
}
