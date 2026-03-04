import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;

    const searchedContacts = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(searchedContacts), { status: 200 });
  } catch (e) {
    return new Response("Failed to search for contacts: ", e.message, {
      status: 500,
    });
  }
};
