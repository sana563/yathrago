"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/ui/organisms/MainNavbar";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Route to discover for users, trip-advisor for places/activities
      if (session) {
        router.push(`/trip-advisor?query=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const categories = [
    { name: "Hotels", color: "#FF6B6B", emoji: "🏨", link: "/trip-advisor?category=hotels" },
    { name: "Activities", color: "#4ADE80", emoji: "🎭", link: "/trip-advisor?category=activities" },
    { name: "Restaurants", color: "#00D9FF", emoji: "🍽️", link: "/trip-advisor?category=restaurants" },
    { name: "Travel Stories", color: "#FFC700", emoji: "✈️", link: "/trip-advisor?category=stories" },
  ];

  const interests = [
    { name: "Outdoors", color: "#FF6B6B", image: "🏔️" },
    { name: "Food", color: "#FFC700", image: "🍜" },
    { name: "Culture", color: "#FF69B4", image: "🎨" },
    { name: "Water", color: "#00D9FF", image: "🌊" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#4ADE80] via-[#00D9FF] to-[#FFC700] py-20 px-4 border-b-4 border-black">
        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-[#FF6B6B] border-4 border-black rotate-45 hidden lg:block"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-white border-4 border-black rounded-full hidden lg:block"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-black uppercase tracking-tight">
            Where to?
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Places to go, things to do, hotels..."
                className="flex-1 px-6 py-4 text-lg font-medium border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-lg text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={session ? cat.link : "/register"}
                className="px-6 py-3 bg-white border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                style={{ backgroundColor: cat.color }}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Card */}
        <div className="bg-[#4ADE80] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-16">
          <div className="grid md:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-64 md:h-auto bg-gradient-to-br from-[#00D9FF] to-[#0099FF] border-r-0 md:border-r-4 border-black flex items-center justify-center">
              <div className="text-9xl">🌏</div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">
                Find Companions for Everything You&apos;re Into
              </h2>
              <p className="text-xl font-medium mb-6">
                Browse 400,000+ travelers and connect with people going to the same places as you.
              </p>
              <Link
                href={session ? "/discover" : "/register"}
                className="inline-block px-8 py-4 bg-black text-white hover:text-white border-4 border-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-fit"
              >
                {session ? "Discover Now" : "Join Now"}
              </Link>
            </div>
          </div>
        </div>

        {/* Interest Cards */}
        <h2 className="text-4xl font-black mb-8 uppercase">Find companions by interest</h2>
        <p className="text-xl mb-8 font-medium">Whatever you&apos;re into, we&apos;ve got it</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {interests.map((interest) => (
            <Link
              key={interest.name}
              href={`/discover?interest=${interest.name.toLowerCase()}`}
              className="relative h-64 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden group"
              style={{ backgroundColor: interest.color }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30 group-hover:scale-110 transition-transform">
                {interest.image}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t-4 border-black text-black">
                <h3 className="text-2xl font-black uppercase">{interest.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="bg-[#FFC700] border-y-4 border-black py-16 px-4 text-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-6 uppercase text-black">
              Ready to Find Your Travel Buddy?
            </h2>
            <p className="text-xl font-medium mb-8 text-black">
              Join thousands of travelers connecting worldwide
            </p>
            <Link
              href="/register"
              className="inline-block px-12 py-5 bg-black text-white hover:text-white border-4 border-black font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Get Started Free →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold">© 2026 YathraGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
