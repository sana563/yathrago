"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import SearchBar from "../molecules/SearchBar";

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        console.log("Fetching results for query:", query); // Additional console log for debugging
        const res = await fetch(`api/users/searchOther?query=${query}`);
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <SearchBar />
      {users.length > 0 ? (
        users.map((user, index) => (
          <div
            key={index}
            className="mt-4 p-4 border border-gray-200 rounded-md"
          >
            <div>{user.name}</div>
            <div>
              {user.travelCity}, {user.travelCountry}
            </div>
          </div>
        ))
      ) : (
        <div>No results found.</div>
      )}
    </div>
  );
};

export default SearchResults;
