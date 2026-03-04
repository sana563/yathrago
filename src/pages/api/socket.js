import { Server } from "socket.io";
import { connectToDB } from "@/mongodb";

let io;

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("🔌 Initializing Socket.io server...");

        io = new Server(res.socket.server, {
            path: "/api/socket",
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("✅ Client connected:", socket.id);

            // Join a specific chat room
            socket.on("join-room", (roomId) => {
                socket.join(roomId);
                console.log(`👤 User ${socket.id} joined room: ${roomId}`);

                // Notify others in the room
                socket.to(roomId).emit("user-joined", {
                    socketId: socket.id,
                    timestamp: new Date(),
                });
            });

            // Leave a chat room
            socket.on("leave-room", (roomId) => {
                socket.leave(roomId);
                console.log(`👋 User ${socket.id} left room: ${roomId}`);

                socket.to(roomId).emit("user-left", {
                    socketId: socket.id,
                    timestamp: new Date(),
                });
            });

            // New message sent
            socket.on("send-message", ({ roomId, message, userEmail, userName }) => {
                console.log(`💬 Message in room ${roomId} from ${userName}`);

                // Broadcast to all users in the room including sender
                io.to(roomId).emit("new-message", {
                    message,
                    userEmail,
                    userName,
                    timestamp: new Date(),
                });
            });

            // Poll created
            socket.on("create-poll", ({ roomId, poll, userEmail, userName }) => {
                console.log(`📊 Poll created in room ${roomId}`);

                io.to(roomId).emit("new-poll", {
                    poll,
                    userEmail,
                    userName,
                    timestamp: new Date(),
                });
            });

            // Vote on poll
            socket.on("vote-poll", ({ roomId, messageId, optionIndex, userEmail }) => {
                console.log(`🗳️ Vote in room ${roomId}`);

                io.to(roomId).emit("poll-voted", {
                    messageId,
                    optionIndex,
                    userEmail,
                    timestamp: new Date(),
                });
            });

            // Travel tip shared
            socket.on("share-tip", ({ roomId, tip, userEmail, userName }) => {
                console.log(`💡 Tip shared in room ${roomId}`);

                io.to(roomId).emit("new-tip", {
                    tip,
                    userEmail,
                    userName,
                    timestamp: new Date(),
                });
            });

            // User is typing
            socket.on("typing", ({ roomId, userName, isTyping }) => {
                socket.to(roomId).emit("user-typing", {
                    userName,
                    isTyping,
                });
            });

            // Member joined room
            socket.on("member-joined", ({ roomId, member }) => {
                io.to(roomId).emit("room-member-joined", {
                    member,
                    timestamp: new Date(),
                });
            });

            // Member left room
            socket.on("member-left", ({ roomId, memberEmail, memberName }) => {
                io.to(roomId).emit("room-member-left", {
                    memberEmail,
                    memberName,
                    timestamp: new Date(),
                });
            });

            // SOS Alert - Broadcast to ALL connected clients
            socket.on("trigger-sos", ({ userId, userName, userEmail, userLocation, message, alertId }) => {
                console.log(`🚨 SOS ALERT from ${userName} (${userEmail})`);

                // Broadcast to ALL connected clients
                io.emit("sos-alert", {
                    alertId,
                    userId,
                    userName,
                    userEmail,
                    userLocation,
                    message: message || "I need help!",
                    timestamp: new Date(),
                });
            });

            // SOS Resolved - Notify all clients
            socket.on("resolve-sos", ({ alertId, userName }) => {
                console.log(`✅ SOS RESOLVED by ${userName}`);

                io.emit("sos-resolved", {
                    alertId,
                    userName,
                    timestamp: new Date(),
                });
            });

            // Chat functionality - Join chat room
            socket.on("joinChat", (chatId) => {
                socket.join(chatId);
                console.log(`💬 User ${socket.id} joined chat: ${chatId}`);
                // Confirm join to the client
                socket.emit("joinedChat", { chatId, success: true });
            });

            // Chat functionality - Leave chat room
            socket.on("leaveChat", (chatId) => {
                socket.leave(chatId);
                console.log(`👋 User ${socket.id} left chat: ${chatId}`);
            });

            // Chat functionality - Send message
            socket.on("sendMessage", async (messageData) => {
                console.log(`📨 Sending message in chat ${messageData.chatId} from ${messageData.sender}`);

                try {
                    // Connect to MongoDB
                    await connectToDB();
                    
                    // Import User model dynamically
                    const { default: User } = await import("@/models/User");
                    
                    // Fetch the sender details
                    const sender = await User.findById(messageData.sender).select("name email profilePic");
                    
                    if (!sender) {
                        console.warn("⚠️ Sender not found in database:", messageData.sender);
                    }
                    
                    // Broadcast message to all users in the chat room with populated sender
                    const messageWithSender = {
                        ...messageData,
                        sender: sender || { _id: messageData.sender, name: "Unknown", email: "unknown@example.com" },
                    };
                    
                    console.log(`📤 Broadcasting to room ${messageData.chatId}`);
                    const socketsInRoom = await io.in(messageData.chatId).fetchSockets();
                    console.log(`👥 Sockets in room ${messageData.chatId}: ${socketsInRoom.length}`, socketsInRoom.map(s => s.id));
                    
                    io.to(messageData.chatId).emit("receiveMessage", messageWithSender);
                    console.log(`✅ Message broadcast complete for chat ${messageData.chatId}`);
                } catch (error) {
                    console.error("❌ Error broadcasting message:", error);
                    console.error("❌ Error details:", error.message, error.stack);
                }
            });

            // Disconnect
            socket.on("disconnect", () => {
                console.log("❌ Client disconnected:", socket.id);
            });
        });

        console.log("✅ Socket.io server initialized");
    } else {
        console.log("♻️ Socket.io server already running");
    }

    res.end();
}
