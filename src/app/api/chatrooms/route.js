import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import ChatRoom from "@/models/ChatRoom";

// GET - Fetch all chat rooms or filter by query
export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const destination = searchParams.get("destination");
        const continent = searchParams.get("continent");
        const category = searchParams.get("category");
        const query = searchParams.get("query");

        let filter = { isActive: true };

        if (destination && destination !== "all") {
            filter.destination = { $regex: destination, $options: "i" };
        }
        if (continent && continent !== "all") {
            filter.continent = continent;
        }
        if (category && category !== "all") {
            filter.category = category;
        }
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ];
        }

        const chatRooms = await ChatRoom.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(chatRooms, { status: 200 });
    } catch (err) {
        console.error("ERROR_GET_CHATROOMS", err);
        return NextResponse.json({ message: "Failed to fetch chat rooms" }, { status: 500 });
    }
}

// POST - Create a new chat room
export async function POST(req) {
    try {
        await connectToDB();

        const body = await req.json();
        const {
            name,
            description,
            destination,
            continent,
            travelDates,
            maxMembers,
            creator,
            creatorName,
            tags,
            category,
            roomImage,
        } = body;

        // Validate required fields
        if (!name || !description || !destination || !creator || !creatorName) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new chat room with creator as first member
        const newChatRoom = await ChatRoom.create({
            name,
            description,
            destination,
            continent,
            travelDates,
            maxMembers: maxMembers || 50,
            creator,
            creatorName,
            members: [{
                email: creator,
                name: creatorName,
                joinedAt: new Date(),
            }],
            tags: tags || [],
            category: category || "Adventure",
            roomImage: roomImage || "",
            messages: [{
                sender: "system",
                senderName: "Travel Companion",
                content: `${creatorName} created this chat room for ${destination}! 🎉`,
                messageType: "join",
            }],
        });

        return NextResponse.json(newChatRoom, { status: 201 });
    } catch (err) {
        console.error("ERROR_CREATE_CHATROOM", err);
        return NextResponse.json({ message: "Failed to create chat room" }, { status: 500 });
    }
}
