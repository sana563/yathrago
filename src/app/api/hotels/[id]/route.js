import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Hotel from "@/models/Hotel";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const hotel = await Hotel.findById(id).lean();
    
    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await req.json();
    
    const hotel = await Hotel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const hotel = await Hotel.findByIdAndDelete(id);
    
    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
