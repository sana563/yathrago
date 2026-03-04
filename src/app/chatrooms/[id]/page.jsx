"use client";
import React, { useState, useEffect, useRef } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import { useSocket } from "@/context/SocketContext";

const ChatRoomPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const { socket, isConnected, isConnecting } = useSocket();
    const [chatRoom, setChatRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [showPollModal, setShowPollModal] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const isMember = chatRoom?.members?.some(m => m.email === session?.user?.email);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated" && params.id) {
            fetchChatRoom();
        }
    }, [status, params.id]);

    // Socket connection and event listeners
    useEffect(() => {
        // Only initialize socket listeners when socket is ready AND connected
        if (!socket || !isConnected || !params.id || !session) return;

        console.log("🔌 Initializing chat room socket listeners for:", params.id);

        // Join the room
        socket.emit("join-room", params.id);

        // Listen for new messages
        socket.on("new-message", ({ message: newMsg, userEmail, userName }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                
                // Prevent duplicate messages from current user (optimistic update already added it)
                const recentMessages = prev.messages.slice(-5);
                const isDuplicate = recentMessages.some(msg => 
                    msg.sender === userEmail && 
                    msg.content === newMsg.content &&
                    msg.messageType === newMsg.messageType &&
                    (Date.now() - new Date(msg.createdAt).getTime()) < 5000
                );
                
                if (isDuplicate && userEmail === session?.user?.email) {
                    return prev;
                }
                
                return {
                    ...prev,
                    messages: [...prev.messages, {
                        sender: userEmail,
                        senderName: userName,
                        content: newMsg.content,
                        messageType: newMsg.messageType,
                        createdAt: new Date(),
                        _id: Date.now().toString(),
                    }],
                };
            });
        });

        // Listen for new polls
        socket.on("new-poll", ({ poll, userEmail, userName }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                
                // Prevent duplicate polls from current user
                const recentMessages = prev.messages.slice(-5);
                const isDuplicate = recentMessages.some(msg => 
                    msg.sender === userEmail && 
                    msg.content === poll.content &&
                    msg.messageType === "poll" &&
                    (Date.now() - new Date(msg.createdAt).getTime()) < 5000
                );
                
                if (isDuplicate && userEmail === session?.user?.email) {
                    return prev;
                }
                
                return {
                    ...prev,
                    messages: [...prev.messages, {
                        sender: userEmail,
                        senderName: userName,
                        content: poll.content,
                        messageType: "poll",
                        pollOptions: poll.pollOptions,
                        createdAt: new Date(),
                        _id: Date.now().toString(),
                    }],
                };
            });
        });

        // Listen for poll votes
        socket.on("poll-voted", ({ messageId, optionIndex, userEmail: voterEmail }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                const updatedMessages = prev.messages.map(msg => {
                    if (msg._id === messageId && msg.messageType === "poll") {
                        const updatedOptions = msg.pollOptions.map((opt, i) => {
                            // Remove voter from all options
                            const filteredVotes = opt.votes.filter(email => email !== voterEmail);
                            // Add voter to selected option
                            if (i === optionIndex) {
                                return { ...opt, votes: [...filteredVotes, voterEmail] };
                            }
                            return { ...opt, votes: filteredVotes };
                        });
                        return { ...msg, pollOptions: updatedOptions };
                    }
                    return msg;
                });
                return { ...prev, messages: updatedMessages };
            });
        });

        // Listen for travel tips
        socket.on("new-tip", ({ tip, userEmail, userName }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                
                // Prevent duplicate tips from current user
                const recentMessages = prev.messages.slice(-5);
                const isDuplicate = recentMessages.some(msg => 
                    msg.sender === userEmail && 
                    msg.content === tip &&
                    msg.messageType === "tip" &&
                    (Date.now() - new Date(msg.createdAt).getTime()) < 5000
                );
                
                if (isDuplicate && userEmail === session?.user?.email) {
                    return prev;
                }
                
                return {
                    ...prev,
                    messages: [...prev.messages, {
                        sender: userEmail,
                        senderName: userName,
                        content: tip,
                        messageType: "tip",
                        createdAt: new Date(),
                        _id: Date.now().toString(),
                    }],
                };
            });
        });

        // Listen for member joins
        socket.on("room-member-joined", ({ member }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    members: [...prev.members, member],
                    messages: [...prev.messages, {
                        sender: "system",
                        senderName: "Travel Companion",
                        content: `${member.name} joined the adventure! 🎒`,
                        messageType: "join",
                        createdAt: new Date(),
                        _id: Date.now().toString(),
                    }],
                };
            });
        });

        // Listen for member leaves
        socket.on("room-member-left", ({ memberEmail, memberName }) => {
            setChatRoom(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    members: prev.members.filter(m => m.email !== memberEmail),
                    messages: [...prev.messages, {
                        sender: "system",
                        senderName: "Travel Companion",
                        content: `${memberName} left the chat room.`,
                        messageType: "leave",
                        createdAt: new Date(),
                        _id: Date.now().toString(),
                    }],
                };
            });
        });

        // Listen for typing indicators
        socket.on("user-typing", ({ userName, isTyping }) => {
            if (isTyping) {
                setTypingUsers(prev => [...new Set([...prev, userName])]);
            } else {
                setTypingUsers(prev => prev.filter(name => name !== userName));
            }
        });

        // Cleanup
        return () => {
            socket.emit("leave-room", params.id);
            socket.off("new-message");
            socket.off("new-poll");
            socket.off("poll-voted");
            socket.off("new-tip");
            socket.off("room-member-joined");
            socket.off("room-member-left");
            socket.off("user-typing");
        };
    }, [socket, isConnected, params.id, session]);

    // Polling mechanism - fetch new messages every 3 seconds as fallback
    useEffect(() => {
        if (!params.id || status !== "authenticated" || !isMember) return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/chatrooms/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setChatRoom(prev => {
                        // Only update if there are actual changes
                        if (!prev) return data;
                        
                        const hasNewMessages = data.messages.length > prev.messages.length;
                        const hasDifferentMembers = data.members.length !== prev.members.length;
                        
                        if (hasNewMessages || hasDifferentMembers) {
                            return data;
                        }
                        
                        // Check if poll votes changed
                        const pollsChanged = data.messages.some((msg, idx) => {
                            if (msg.messageType === "poll" && prev.messages[idx]?.messageType === "poll") {
                                return JSON.stringify(msg.pollOptions) !== JSON.stringify(prev.messages[idx]?.pollOptions);
                            }
                            return false;
                        });
                        
                        return pollsChanged ? data : prev;
                    });
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(pollInterval);
    }, [params.id, status, isMember]);

    useEffect(() => {
        scrollToBottom();
    }, [chatRoom?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatRoom = async () => {
        try {
            // Add timeout protection (15 seconds)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch(`/api/chatrooms/${params.id}`, {
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setChatRoom(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching chat room:", error);
            if (error.name === 'AbortError') {
                setError("Connection timeout. Please check your internet and try again.");
            } else {
                setError("Failed to load chat room. Please refresh the page.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        try {
            const res = await fetch(`/api/chatrooms/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "join",
                    userEmail: session.user.email,
                    userName: session.user.name || session.user.email.split("@")[0],
                }),
            });

            if (res.ok) {
                const updatedRoom = await res.json();
                setChatRoom(updatedRoom);

                // Notify others via socket
                if (socket) {
                    socket.emit("member-joined", {
                        roomId: params.id,
                        member: {
                            email: session.user.email,
                            name: session.user.name || session.user.email.split("@")[0],
                            joinedAt: new Date(),
                        },
                    });
                }
            }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const handleSendMessage = async (e, messageType = "text", pollOptions = null) => {
        e?.preventDefault();
        if ((!message.trim() && messageType === "text") || sending) return;

        setSending(true);
        const messageContent = message;
        setMessage(""); // Clear immediately for better UX

        try {
            const res = await fetch(`/api/chatrooms/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: messageType === "tip" ? "tip" : "message",
                    userEmail: session.user.email,
                    userName: session.user.name || session.user.email.split("@")[0],
                    message: {
                        content: messageContent,
                        messageType,
                        pollOptions: pollOptions || [],
                    },
                }),
            });

            if (res.ok) {
                setShowPollModal(false);

                // Immediately add message to local state (optimistic update)
                const newMessage = {
                    sender: session.user.email,
                    senderName: session.user.name || session.user.email.split("@")[0],
                    content: messageContent,
                    messageType,
                    pollOptions: messageType === "poll" ? pollOptions : undefined,
                    createdAt: new Date(),
                    _id: Date.now().toString(),
                };

                setChatRoom(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        messages: [...prev.messages, newMessage],
                    };
                });

                // Emit socket event for other users
                if (socket) {
                    if (messageType === "poll") {
                        socket.emit("create-poll", {
                            roomId: params.id,
                            poll: {
                                content: messageContent,
                                pollOptions: pollOptions || [],
                            },
                            userEmail: session.user.email,
                            userName: session.user.name || session.user.email.split("@")[0],
                        });
                    } else if (messageType === "tip") {
                        socket.emit("share-tip", {
                            roomId: params.id,
                            tip: messageContent,
                            userEmail: session.user.email,
                            userName: session.user.name || session.user.email.split("@")[0],
                        });
                    } else {
                        socket.emit("send-message", {
                            roomId: params.id,
                            message: {
                                content: messageContent,
                                messageType,
                            },
                            userEmail: session.user.email,
                            userName: session.user.name || session.user.email.split("@")[0],
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessage(messageContent); // Restore message on error
        } finally {
            setSending(false);
        }
    };

    const handleVote = async (messageId, optionIndex) => {
        try {
            const res = await fetch(`/api/chatrooms/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "vote",
                    userEmail: session.user.email,
                    userName: session.user.name || session.user.email.split("@")[0],
                    pollData: { messageId, optionIndex },
                }),
            });

            if (res.ok && socket) {
                socket.emit("vote-poll", {
                    roomId: params.id,
                    messageId,
                    optionIndex,
                    userEmail: session.user.email,
                });
            }
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleTyping = (value) => {
        setMessage(value);

        if (socket && isMember) {
            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Emit typing event
            socket.emit("typing", {
                roomId: params.id,
                userName: session.user.name || session.user.email.split("@")[0],
                isTyping: true,
            });

            // Stop typing after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("typing", {
                    roomId: params.id,
                    userName: session.user.name || session.user.email.split("@")[0],
                    isTyping: false,
                });
            }, 2000);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 font-bold text-gray-600">
                        {isConnecting ? "Connecting to chat..." : "Loading chat room..."}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
                <div className="bg-white border-8 border-black p-12 max-w-md text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-9xl mb-6">⚠️</div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-black">Connection Error</h3>
                    <p className="font-bold text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            fetchChatRoom();
                        }}
                        className="px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    if (!chatRoom) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
                <div className="bg-white border-8 border-black p-12 max-w-md text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-9xl mb-6">🔍</div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-black">Chat Room Not Found</h3>
                    <p className="font-bold text-gray-600 mb-8">This chat room doesn&apos;t exist or has been deleted.</p>
                    <button
                        onClick={() => router.push("/chatrooms")}
                        className="px-8 py-4 bg-[#FFC700] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        BACK TO ROOMS
                    </button>
                </div>
            </div>
        );
    }

    const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#8B5CF6"];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <MainNavbar />

            {/* Room Header */}
            <section className="bg-gradient-to-r from-[#8B5CF6] to-[#00D9FF] border-b-4 border-black py-6 px-4 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/chatrooms")} className="w-12 h-12 bg-white border-4 border-black font-black text-xl hover:bg-black hover:text-white transition-colors">
                            ←
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase text-black flex items-center gap-2">
                                {chatRoom.name}
                                {isConnected ? (
                                    <span className="text-sm bg-[#4ADE80] px-2 py-1 border-2 border-black animate-pulse">● LIVE</span>
                                ) : isConnecting ? (
                                    <span className="text-sm bg-[#FFC700] px-2 py-1 border-2 border-black">⏳ CONNECTING...</span>
                                ) : (
                                    <span className="text-sm bg-[#FF6B6B] px-2 py-1 border-2 border-black">○ OFFLINE</span>
                                )}
                            </h1>
                            <p className="font-bold text-black/80">📍 {chatRoom.destination} • {chatRoom.members.length} travelers</p>
                        </div>
                    </div>

                    {!isMember && (
                        <button
                            onClick={handleJoinRoom}
                            disabled={chatRoom.members.length >= chatRoom.maxMembers}
                            className="px-6 py-3 bg-[#FFC700] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                        >
                            {chatRoom.members.length >= chatRoom.maxMembers ? "ROOM FULL" : "JOIN ROOM"}
                        </button>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-1 flex max-w-7xl w-full mx-auto">
                {/* Sidebar - Members */}
                <aside className="hidden lg:block w-64 border-r-4 border-black bg-white p-6">
                    <h3 className="text-xl font-black uppercase mb-4 text-black">Travelers ({chatRoom.members.length})</h3>
                    <div className="space-y-3">
                        {chatRoom.members.map((member, i) => (
                            <div key={member.email} className="flex items-center gap-3 p-2 bg-gray-50 border-2 border-black">
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-black"
                                    style={{ backgroundColor: colors[i % colors.length] }}
                                >
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm truncate text-black">{member.name}</p>
                                    {member.email === chatRoom.creator && (
                                        <span className="text-xs font-bold text-[#FFC700]">CREATOR</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {isMember ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {chatRoom.messages.map((msg, index) => (
                                    <MessageBubble
                                        key={msg._id || index}
                                        message={msg}
                                        isOwn={msg.sender === session?.user?.email}
                                        onVote={handleVote}
                                        colors={colors}
                                        index={index}
                                    />
                                ))}

                                {/* Typing Indicator */}
                                {typingUsers.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 border-2 border-black px-4 py-2 rounded-full">
                                            <p className="font-bold text-xs text-black">
                                                {typingUsers[0]} {typingUsers.length > 1 && `+${typingUsers.length - 1}`} typing...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="border-t-4 border-black p-4 bg-gray-50">
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setShowPollModal(true)}
                                        className="px-4 py-2 bg-[#00D9FF] border-2 border-black font-black text-xs hover:bg-black hover:text-white transition-colors"
                                    >
                                        📊 POLL
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            if (message.trim()) {
                                                handleSendMessage(e, "tip");
                                            }
                                        }}
                                        className="px-4 py-2 bg-[#FFC700] border-2 border-black font-black text-xs hover:bg-black hover:text-white transition-colors"
                                    >
                                        💡 TRAVEL TIP
                                    </button>
                                </div>

                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => handleTyping(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-black placeholder-gray-400 bg-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !message.trim()}
                                        className="px-8 py-3 bg-[#4ADE80] border-4 border-black font-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        SEND
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12">
                            <div className="text-center">
                                <div className="text-9xl mb-6">🔒</div>
                                <h3 className="text-4xl font-black uppercase mb-4 text-black">Join to Chat</h3>
                                <p className="font-bold text-xl text-gray-600 mb-8">You need to join this room to participate in conversations</p>
                                <button
                                    onClick={handleJoinRoom}
                                    disabled={chatRoom.members.length >= chatRoom.maxMembers}
                                    className="px-10 py-4 bg-[#4ADE80] text-black border-4 border-black font-black text-xl hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] disabled:opacity-50"
                                >
                                    {chatRoom.members.length >= chatRoom.maxMembers ? "ROOM IS FULL" : "JOIN NOW"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Poll Modal */}
            {showPollModal && (
                <PollModal
                    onClose={() => setShowPollModal(false)}
                    onSubmit={(pollQuestion, options) => {
                        setMessage(pollQuestion);
                        handleSendMessage(null, "poll", options.map(opt => ({ option: opt, votes: [] })));
                    }}
                />
            )}
        </div>
    );
};

// Message Bubble Component (same as before)
const MessageBubble = ({ message, isOwn, onVote, colors, index }) => {
    if (message.messageType === "join" || message.messageType === "leave") {
        return (
            <div className="flex justify-center">
                <div className="px-4 py-2 bg-gray-200 border-2 border-black font-bold text-sm text-black">
                    {message.content}
                </div>
            </div>
        );
    }

    if (message.messageType === "tip") {
        return (
            <div className="bg-[#FFC700] border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-start gap-3">
                    <span className="text-3xl">💡</span>
                    <div className="flex-1">
                        <p className="font-black text-sm mb-1 text-black">{message.senderName}&apos;s Travel Tip</p>
                        <p className="font-medium text-black">{message.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (message.messageType === "poll") {
        return (
            <div className="bg-[#00D9FF] border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black mb-3 text-black">📊 {message.content}</p>
                <div className="space-y-2">
                    {message.pollOptions?.map((option, i) => {
                        const totalVotes = message.pollOptions.reduce((sum, opt) => sum + opt.votes.length, 0);
                        const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;

                        return (
                            <button
                                key={i}
                                onClick={() => onVote(message._id, i)}
                                className="w-full p-3 bg-white border-2 border-black font-bold text-left hover:bg-gray-100 transition-colors relative overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-[#4ADE80] opacity-30"
                                    style={{ width: `${percentage}%` }}
                                />
                                <div className="relative flex justify-between items-center">
                                    <span className="text-black">{option.option}</span>
                                    <span className="font-black text-xs text-black">{option.votes.length} ({percentage}%)</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md ${isOwn ? "bg-[#4ADE80]" : "bg-white"} border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                {!isOwn && <p className="font-black text-xs mb-1 text-[#8B5CF6]">{message.senderName}</p>}
                <p className="font-medium text-black">{message.content}</p>
                <p className="text-xs font-bold text-black/60 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

// Poll Modal Component (same as before)
const PollModal = ({ onClose, onSubmit }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validOptions = options.filter(opt => opt.trim());
        if (question.trim() && validOptions.length >= 2) {
            onSubmit(question, validOptions);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white border-8 border-black w-full max-w-lg shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#00D9FF] border-b-8 border-black p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-black uppercase text-black">Create Poll</h2>
                    <button onClick={onClose} className="w-12 h-12 bg-[#FF6B6B] border-4 border-black font-black text-2xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-lg font-black mb-2 uppercase text-black">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., Where should we eat dinner?"
                            className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-black mb-2 uppercase text-black">Options</label>
                        {options.map((opt, i) => (
                            <input
                                key={i}
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[i] = e.target.value;
                                    setOptions(newOpts);
                                }}
                                placeholder={`Option ${i + 1}`}
                                className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none mb-2"
                                required={i < 2}
                            />
                        ))}
                        {options.length < 5 && (
                            <button
                                type="button"
                                onClick={() => setOptions([...options, ""])}
                                className="w-full px-4 py-2 border-2 border-dashed border-black font-bold text-black hover:bg-gray-100"
                            >
                                + Add Option
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-xl text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        CREATE POLL
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function ChatRoom() {
    return (
        <Provider>
            <ChatRoomPage />
        </Provider>
    );
}
