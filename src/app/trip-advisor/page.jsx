"use client";
import React, { useState, useEffect, Suspense } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import HotelCard from "@/ui/molecules/HotelCard";
import ActivityCard from "@/ui/molecules/ActivityCard";
import RestaurantCard from "@/ui/molecules/RestaurantCard";
import TravelStoryCard from "@/ui/molecules/TravelStoryCard";
import DetailModal from "@/ui/organisms/DetailModal";

const TripAdvisorPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "hotels");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    country: searchParams.get("country") || "",
    priceRange: "",
    rating: "",
    sortBy: "rating"
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchItems();
    }
  }, [status, selectedCategory, filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      const params = new URLSearchParams();
      
      // Add common params
      if (searchQuery) params.append("query", searchQuery);
      if (filters.city) params.append("city", filters.city);
      if (filters.country) params.append("country", filters.country);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      
      // Determine endpoint based on category
      switch (selectedCategory) {
        case "hotels":
          endpoint = `/api/hotels?${params.toString()}`;
          break;
        case "activities":
          endpoint = `/api/activities?${params.toString()}`;
          break;
        case "restaurants":
          endpoint = `/api/restaurants?${params.toString()}`;
          break;
        case "stories":
          endpoint = `/api/travel-stories?${params.toString()}`;
          break;
        default:
          endpoint = `/api/hotels?${params.toString()}`;
      }
      
      const res = await fetch(endpoint, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await res.json();
      
      if (res.ok) {
        setItems(Array.isArray(data) ? data : []);
      } else {
        console.error("Error fetching items:", data.error);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      city: "",
      country: "",
      priceRange: "",
      rating: "",
      sortBy: "rating"
    });
  };

  if (status === "loading") {
    return <Loader />;
  }

  const categories = [
    { id: "hotels", name: "Hotels", emoji: "🏨" },
    { id: "activities", name: "Activities", emoji: "🎭" },
    { id: "restaurants", name: "Restaurants", emoji: "🍽️" },
    { id: "stories", name: "Stories", emoji: "✈️" },
  ];

  const priceRanges = {
    hotels: ["Budget", "Mid-range", "Luxury", "Ultra-Luxury"],
    activities: ["Free", "Budget", "Mid-range", "Expensive"],
    restaurants: ["Budget", "Mid-range", "Fine Dining", "Luxury"],
    stories: []
  };

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name (A-Z)" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#FF6B6B] to-[#FFC700] border-b-4 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase text-black">
            Trip Advisor
          </h1>
          <p className="text-xl font-bold text-black mb-8">
            Discover amazing destinations, activities, and experiences
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, activities, restaurants..."
                className="flex-1 px-6 py-4 text-lg font-medium border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-lg text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b-4 border-black py-6 px-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 border-4 border-black font-black whitespace-nowrap transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${
                  selectedCategory === cat.id
                    ? "bg-[#FFC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
                    : "bg-white text-black"
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-[#FAFAFA] border-b-2 border-black py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              placeholder="City"
              className="px-4 py-2 border-3 border-black font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
            <input
              type="text"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              placeholder="Country"
              className="px-4 py-2 border-3 border-black font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
            
            {priceRanges[selectedCategory] && priceRanges[selectedCategory].length > 0 && (
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="px-4 py-2 border-3 border-black font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white"
              >
                <option value="">All Prices</option>
                {priceRanges[selectedCategory].map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            )}
            
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="px-4 py-2 border-3 border-black font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-4 py-2 border-3 border-black font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#FF6B6B] border-3 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Clear Filters
            </button>

            <button
              onClick={fetchItems}
              className="px-4 py-2 bg-[#4ADE80] border-3 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black">
                Found {items.length} {selectedCategory}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                switch (selectedCategory) {
                  case "hotels":
                    return <HotelCard key={item._id} hotel={item} onClick={() => handleCardClick(item)} />;
                  case "activities":
                    return <ActivityCard key={item._id} activity={item} onClick={() => handleCardClick(item)} />;
                  case "restaurants":
                    return <RestaurantCard key={item._id} restaurant={item} onClick={() => handleCardClick(item)} />;
                  case "stories":
                    return <TravelStoryCard key={item._id} story={item} onClick={() => handleCardClick(item)} />;
                  default:
                    return null;
                }
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🌍</div>
            <h3 className="text-3xl font-black mb-4 uppercase text-black">
              No Results Found
            </h3>
            <p className="text-xl font-medium text-black mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#FFC700] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
        type={selectedCategory}
      />
    </div>
  );
};

export default function TripAdvisor() {
  return (
    <Provider>
      <Suspense fallback={<Loader />}>
        <TripAdvisorPage />
      </Suspense>
    </Provider>
  );
}
