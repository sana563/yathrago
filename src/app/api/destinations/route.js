import { connectToDB } from "@/mongodb";
import Destination from "@/models/Destination";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify(destinations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch destinations" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const destination = await Destination.create(body);

    return new Response(JSON.stringify(destination), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating destination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create destination", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
