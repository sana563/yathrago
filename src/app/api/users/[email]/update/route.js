import { connectToDB } from "@/mongodb";
import User from "@/models/User";

// Handle GET request to fetch a user by email
export async function GET(request, { params }) {
  const { email } = params;

  try {
    await connectToDB();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch user" }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  const { email } = params;
  const body = await request.json();

  try {
    await connectToDB();
    const user = await User.findOneAndUpdate(
      { email }, // Find the user by email
      { $set: body }, // Update the fields provided in the body
      { new: true, runValidators: true } // Options: return the updated document, and run validators
    ).exec();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ message: "Failed to update user" }), {
      status: 500,
    });
  }
}
