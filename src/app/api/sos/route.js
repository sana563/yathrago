import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectToDB } from "@/mongodb";
import SOSAlert from "@/models/SOSAlert";
import User from "@/models/User";

// POST - Trigger SOS Alert
export async function POST(req) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectToDB();

    const body = await req.json();
    const { message } = body;

    // Get user details
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Create SOS alert
    const sosAlert = await SOSAlert.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userLocation: {
        travelCity: user.travelCity || "",
        travelCountry: user.travelCountry || "",
      },
      message: message || "I need help!",
      isActive: true,
    });

    return NextResponse.json(
      { 
        message: "SOS alert sent successfully!",
        alert: sosAlert 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating SOS alert:", error);
    return NextResponse.json(
      { error: "Failed to send SOS alert" },
      { status: 500 }
    );
  }
}

// GET - Get all active SOS alerts
export async function GET(req) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectToDB();

    const activeAlerts = await SOSAlert.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(activeAlerts, { status: 200 });
  } catch (error) {
    console.error("Error fetching SOS alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch SOS alerts" },
      { status: 500 }
    );
  }
}

// PATCH - Resolve SOS alert
export async function PATCH(req) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectToDB();

    const body = await req.json();
    const { alertId } = body;

    const alert = await SOSAlert.findById(alertId);

    if (!alert) {
      return NextResponse.json(
        { error: "SOS alert not found." },
        { status: 404 }
      );
    }

    // Only the user who created the alert can resolve it
    if (alert.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only resolve your own alerts." },
        { status: 403 }
      );
    }

    alert.isActive = false;
    alert.resolvedAt = new Date();
    await alert.save();

    return NextResponse.json(
      { 
        message: "SOS alert resolved successfully!",
        alert 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resolving SOS alert:", error);
    return NextResponse.json(
      { error: "Failed to resolve SOS alert" },
      { status: 500 }
    );
  }
}
