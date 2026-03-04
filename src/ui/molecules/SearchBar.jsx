"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [groupName, setGroupName] = useState("Chat");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Ensure hooks are always executed in the same order
  const currentUser = session?.user;

  // useEffect must always be executed unconditionally
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const res = await fetch(`/api/users/searchOther?query=${query}`);
          const data = await res.json();
          setSuggestions(data);
          console.log("Suggestions:", data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  const createChat = async (suggestion) => {
    if (!currentUser) {
      console.error("No current user found.");
      return;
    }

    const selectedUser = suggestion;

    if (!groupName.trim()) {
      console.warn("Group name or selected user is missing.");
      return;
    }

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserID: currentUser._id,
          members: [currentUser._id, selectedUser._id],
          isGroupChat: false,
          name: groupName || "Chat",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("Chat created:", result.chat || result);
        router.push(`/chats/${result.chat?._id || result._id}`);
      } else {
        console.error("Failed to create chat:", result.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  // Make sure not to render hooks conditionally
  if (status === "loading") {
    return <div>Loading...</div>; // Return loading state
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city or country..."
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => createChat(suggestion)}
            >
              {suggestion.name} - {suggestion.travelCity},{" "}
              {suggestion.travelCountry}
            </li>
          ))}
          {suggestions.length > 3 && (
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer text-blue-500"
              onClick={() => router.push(`/search?query=${query}`)}
            >
              View all results
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
