"use client";
import React, { useState, useEffect } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const ChatRoomsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchChatRooms();
        }
    }, [status, selectedCategory]);

    const fetchChatRooms = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                category: selectedCategory,
                query: searchQuery
            });
            const res = await fetch(`/api/chatrooms?${params.toString()}`);
            const data = await res.json();
            setChatRooms(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching chat rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchChatRooms();
    };

    if (status === "loading") {
        return <Loader />;
    }

    const categories = [
        { id: "all", name: "All Rooms", emoji: "🌍", color: "#FF6B6B" },
        { id: "Adventure", name: "Adventure", emoji: "🏔️", color: "#4ADE80" },
        { id: "Backpacking", name: "Backpacking", emoji: "🎒", color: "#00D9FF" },
        { id: "Luxury", name: "Luxury", emoji: "💎", color: "#FFC700" },
        { id: "Food Tour", name: "Food Tour", emoji: "🍜", color: "#FF69B4" },
        { id: "Cultural", name: "Cultural", emoji: "🏛️", color: "#8B5CF6" },
        { id: "Beach", name: "Beach", emoji: "🏖️", color: "#F97316" },
        { id: "City Break", name: "City Break", emoji: "🏙️", color: "#06B6D4" },
        { id: "Road Trip", name: "Road Trip", emoji: "🚗", color: "#EF4444" },
    ];

    const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#00CED1"];

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <MainNavbar />

            {/* Header */}
            <section className="bg-gradient-to-br from-[#8B5CF6] via-[#00D9FF] to-[#4ADE80] border-b-4 border-black py-12 px-4 relative overflow-hidden">
                <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase text-black italic">
                                CHAT ROOMS
                            </h1>
                            <p className="text-xl font-bold bg-white inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                                {chatRooms.length} ACTIVE TRAVEL COMMUNITIES
                            </p>
                        </div>

                        {/* Create Room Button */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 py-4 bg-[#FFC700] border-4 border-black font-black text-xl text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            + CREATE ROOM
                        </button>
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <section className="bg-white border-b-4 border-black py-8 px-4 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="w-full md:w-96">
                        <div className="flex bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search rooms..."
                                className="flex-1 px-4 py-3 font-bold focus:outline-none text-black"
                            />
                            <button type="submit" className="px-6 bg-[#4ADE80] border-l-4 border-black font-black text-black hover:bg-black hover:text-white transition-colors">
                                GO
                            </button>
                        </div>
                    </form>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 border-4 border-black font-black text-black uppercase text-sm transition-all ${selectedCategory === cat.id
                                    ? "bg-[#FFC700] translate-x-1 translate-y-1 shadow-none"
                                    : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    }`}
                            >
                                <span className="mr-1">{cat.emoji}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chat Rooms Grid */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader />
                    </div>
                ) : chatRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {chatRooms.map((room, index) => (
                            <Link
                                key={room._id}
                                href={`/chatrooms/${room._id}`}
                                className="bg-white border-4 border-black text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all group flex flex-col h-full"
                            >
                                {/* Room Header */}
                                <div
                                    className="h-40 border-b-4 border-black relative overflow-hidden flex items-center justify-center"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                >
                                    <div className="text-8xl">{categories.find(c => c.id === room.category)?.emoji || "🌍"}</div>
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 bg-white border-2 border-black font-black text-xs text-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            {room.category}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white border-2 border-white font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                        {room.members.length}/{room.maxMembers}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black uppercase leading-tight mb-2">{room.name}</h3>
                                    <p className="font-bold text-sm text-gray-600 mb-4">📍 {room.destination}</p>

                                    <p className="font-medium mb-6 line-clamp-2 text-gray-700 leading-relaxed overflow-hidden flex-1">{room.description}</p>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex -space-x-2">
                                            {room.members.slice(0, 3).map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-xs text-black"
                                                    style={{ backgroundColor: colors[i % colors.length] }}
                                                >
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {room.members.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center font-black text-xs">
                                                    +{room.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-bold text-xs text-gray-500">{room.members.length} travelers</span>
                                    </div>

                                    <div className="pt-4 border-t-2 border-black/10 flex justify-between items-center">
                                        <span className="font-black text-sm uppercase underline decoration-4 decoration-[#4ADE80] underline-offset-4">Join Room →</span>
                                        <span className="font-bold text-xs text-gray-400">{room.messages.length} messages</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white border-8 border-black border-dashed">
                        <div className="text-9xl mb-6">💬</div>
                        <h3 className="text-4xl font-black uppercase mb-4">No chat rooms yet</h3>
                        <p className="font-bold text-xl text-gray-500 uppercase mb-8">Be the first to create one!</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-10 py-4 bg-[#4ADE80] text-black border-4 border-black font-black text-xl hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            CREATE ROOM
                        </button>
                    </div>
                )}
            </section>

            {/* Create Room Modal */}
            {showCreateModal && (
                <CreateRoomModal
                    session={session}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchChatRooms();
                    }}
                />
            )}
        </div>
    );
};

// Create Room Modal Component
const CreateRoomModal = ({ session, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        destination: "",
        continent: "",
        category: "Adventure",
        maxMembers: 50,
        tags: "",
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const payload = {
                ...formData,
                creator: session.user.email,
                creatorName: session.user.name || session.user.email.split("@")[0],
                tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            };

            // Remove continent if empty to avoid enum validation error
            if (!payload.continent) {
                delete payload.continent;
            }

            const res = await fetch("/api/chatrooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to create room");
            }
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white border-8 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="bg-[#FFC700] border-b-8 border-black p-6 flex justify-between items-center">
                    <h2 className="text-3xl font-black uppercase text-black">Create Chat Room</h2>
                    <button onClick={onClose} className="w-12 h-12 bg-[#FF6B6B] border-4 border-black font-black text-2xl text-black">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-lg font-black mb-2 uppercase text-black">Room Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Tokyo Adventure Squad"
                            className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-black placeholder-gray-400 bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-black mb-2 uppercase text-black">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what your travel group is about..."
                            rows={3}
                            className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none resize-none text-black placeholder-gray-400 bg-white"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-lg font-black mb-2 uppercase text-black">Destination *</label>
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                placeholder="e.g., Tokyo, Japan"
                                className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-black placeholder-gray-400 bg-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-black mb-2 uppercase text-black">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-black bg-white"
                            >
                                <option>Adventure</option>
                                <option>Backpacking</option>
                                <option>Luxury</option>
                                <option>Food Tour</option>
                                <option>Cultural</option>
                                <option>Beach</option>
                                <option>City Break</option>
                                <option>Road Trip</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-black mb-2 uppercase text-black">Max Members</label>
                        <input
                            type="number"
                            value={formData.maxMembers}
                            onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value ? parseInt(e.target.value) : "" })}
                            min="2"
                            max="100"
                            className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none text-black placeholder-gray-400 bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-xl text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                    >
                        {creating ? "CREATING..." : "CREATE ROOM 🚀"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function ChatRooms() {
    return (
        <Provider>
            <ChatRoomsPage />
        </Provider>
    );
}
