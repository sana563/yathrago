import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import TravelStory from "@/models/TravelStory";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const story = await TravelStory.findById(id)
      .populate('author.userId', 'name email profileImage')
      .lean();
    
    if (!story) {
      return NextResponse.json(
        { error: "Travel story not found" },
        { status: 404 }
      );
    }
    
    // Increment view count
    await TravelStory.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching travel story:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel story" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await req.json();
    
    const story = await TravelStory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!story) {
      return NextResponse.json(
        { error: "Travel story not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error updating travel story:", error);
    return NextResponse.json(
      { error: "Failed to update travel story" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const story = await TravelStory.findByIdAndDelete(id);
    
    if (!story) {
      return NextResponse.json(
        { error: "Travel story not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Travel story deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel story:", error);
    return NextResponse.json(
      { error: "Failed to delete travel story" },
      { status: 500 }
    );
  }
}
