"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SuggestionsList from "./SuggestionsList";
import FriendsList from "./FriendsList";
import Loader from "../atoms/Loader";

const SearchFriend = () => {
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?query=${query}`);
      const data = await response.json();

      const friends = data.map((user) => ({
        name: user.name,
        travelCity: user.travelCity,
        travelCountry: user.travelCountry,
      }));
      setFriends(friends);
    } catch (error) {
      console.error("Failed to load friends", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/users?query=${query}`);
      const data = await response.json();

      const suggestions = data.map((user) => ({
        name: user.name,
        travelCity: user.travelCity,
        travelCountry: user.travelCountry,
      }));

      setSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to load suggestions", error.message);
    }
  };

  return (
    <div className="relative">
      <SearchBar query={query} setQuery={setQuery} onSearch={fetchFriends} />
      {suggestions.length > 0 ? (
        <SuggestionsList
          suggestions={suggestions}
          onSelectSuggestion={setQuery}
        />
      ) : query.length > 2 && !loading && friends.length === 0 ? (
        <p>No corresponding traveller found!</p>
      ) : null}
      {loading ? <Loader /> : <FriendsList friends={friends} />}
    </div>
  );
};

export default SearchFriend;
