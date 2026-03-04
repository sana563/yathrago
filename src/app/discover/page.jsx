"use client";
import React, { useState, useEffect, Suspense } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const DiscoverPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let endpoint = "/api/users";
      if (searchQuery) {
        endpoint = `/api/users/searchOther?query=${encodeURIComponent(searchQuery)}`;
      }
      
      const res = await fetch(endpoint, {
        cache: 'no-store'
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  if (status === "loading") {
    return <Loader />;
  }

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#4ADE80] to-[#00D9FF] border-b-4 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase">
            Discover Travelers
          </h1>
          <p className="text-xl font-bold mb-8">
            Find your perfect travel companion from around the world
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, city, country..."
                className="flex-1 px-6 py-4 text-lg font-medium border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#FFC700] border-4 border-black font-black text-lg text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["all", "online", "verified", "new"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 border-4 border-black font-black text-black uppercase whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-[#FFC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-[#FFC700]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black">
                {users.length} Traveler{users.length !== 1 ? "s" : ""} Found
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user, index) => (
                <div
                  key={user._id || index}
                  className="bg-white border-4 border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  {/* Header with Avatar */}
                  <div
                    className="p-6 border-b-4 border-black text-black"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    <div className="flex items-center gap-4">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-16 h-16 border-4 border-black rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center font-black text-2xl text-black">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-black">{user.name}</h3>
                        {user.email && (
                          <p className="font-medium text-sm truncate text-black">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {user.bio && (
                      <p className="font-medium mb-4">&ldquo;{user.bio}&rdquo;</p>
                    )}

                    {/* Travel Info */}
                    {(user.travelCity || user.travelCountry) && (
                      <div className="mb-4 p-3 bg-[#FAFAFA] border-2 border-black text-black">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">📍</span>
                          <span className="font-black text-sm text-black">Traveling to:</span>
                        </div>
                        <p className="font-bold text-black">
                          {user.travelCity}
                          {user.travelCity && user.travelCountry && ", "}
                          {user.travelCountry}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/chats/new?userId=${user._id}`}
                        className="flex-1 px-4 py-3 bg-[#4ADE80] border-4 border-black font-black text-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                      >
                        Chat
                      </Link>
                      <button className="px-4 py-3 bg-white border-4 border-black font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                        👋
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-black mb-4">No travelers found</h3>
            <p className="text-xl font-medium mb-8">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchUsers();
              }}
              className="px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default function Discover() {
  return (
    <Provider>
      <Suspense fallback={<Loader />}>
        <DiscoverPage />
      </Suspense>
    </Provider>
  );
}
