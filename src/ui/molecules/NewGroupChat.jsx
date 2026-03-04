import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../atoms/Loader";

const NewGroupChat = () => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const currentUser = session?.user;

  useEffect(() => {
    if (currentUser) getFriendList();
  }, [currentUser, search]);

  const getFriendList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        search !== ""
          ? `/api/users/searchContacts?query=${search}`
          : "/api/users"
      );
      const data = await response.json();
      setFriends(data.filter((friend) => friend._id !== currentUser._id));
    } catch (error) {
      console.error("Failed to load friends", error.message);
    }
    setLoading(false);
  };

  const handleSelectFriend = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter((f) => f._id !== friend._id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const createChat = async () => {
    if (!groupName.trim() || selectedFriends.length < 1) return;

    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserID: currentUser._id,
        members: selectedFriends.map((friend) => friend._id),
        isGroupChat: true,
        name: groupName,
      }),
    });

    if (res.ok) {
      const chat = await res.json();
      console.log(chat);
      router.push(`/chats/${chat._id}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 max-w-md mx-auto h-screen">
      <h2 className="text-2xl font-semibold mb-4">Create a New Group Chat</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
      />
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search for friends..."
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
      />
      <div className="space-y-2 mb-4">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectFriend(friend)}
          >
            <span>{friend.name}</span>
            <span>{selectedFriends.includes(friend) ? "✓" : "+"}</span>
          </div>
        ))}
      </div>
      <button
        onClick={createChat}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Create Group Chat
      </button>
    </div>
  );
};

export default NewGroupChat;
