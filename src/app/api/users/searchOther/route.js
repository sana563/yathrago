// /api/users/searchOther/[query]/route.js
import { connectToDB } from "@/mongodb";
import User from "@/models/User";

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url, "http://localhost");
    const query = searchParams.get("query");

    console.log("Received query:", query); // Debugging statement

    const searchQuery = query
      ? {
          $or: [
            { travelCity: { $regex: query, $options: "i" } },
            { travelCountry: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchQuery).select(
      "name travelCity travelCountry"
    );

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.log("Error fetching users:", err.message);
    return new Response(JSON.stringify({ message: "Failed to fetch users" }), {
      status: 500,
    });
  }
};
