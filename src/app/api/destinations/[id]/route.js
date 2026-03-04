import { connectToDB } from "@/mongodb";
import Destination from "@/models/Destination";

export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { id } = params;
    const destination = await Destination.findById(id);

    if (!destination) {
      return new Response(
        JSON.stringify({ error: "Destination not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(destination), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch destination" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
