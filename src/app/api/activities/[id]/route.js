import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import Activity from "@/models/Activity";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const activity = await Activity.findById(id).lean();
    
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const body = await req.json();
    
    const activity = await Activity.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    const activity = await Activity.findByIdAndDelete(id);
    
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}
