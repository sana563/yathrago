"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSocket } from "@/context/SocketContext";

const MainNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { socket, isConnected } = useSocket();
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const navItems = [
    { name: "Discover", path: "/discover" },
    { name: "Trip Advisor", path: "/trip-advisor" },
    { name: "Chat Rooms", path: "/chatrooms" },
  ];

  const isActive = (path) => pathname === path;

  const handleSOSClick = (e) => {
    e.preventDefault();
    console.log("SOS BUTTON CLICKED - Session:", session);
    if (!session?.user) {
      alert("You must be logged in to send an SOS alert.");
      return;
    }
    setShowSOSConfirm(true);
  };

  const confirmSOS = async () => {
    setIsTriggering(true);

    try {
      console.log("🚨 Sending SOS to database...");
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Emergency! I need help immediately!",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send SOS alert");
      }

      const data = await response.json();
      console.log("✅ SOS saved to database:", data);

      console.log("🔌 Socket status - Connected:", isConnected, "Socket:", socket);
      
      if (socket && isConnected) {
        const sosPayload = {
          alertId: data.alert._id,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userLocation: {
            travelCity: session.user.travelCity || "",
            travelCountry: session.user.travelCountry || "",
          },
          message: data.alert.message,
        };
        
        console.log("📡 Emitting trigger-sos event:", sosPayload);
        socket.emit("trigger-sos", sosPayload);
        console.log("✅ SOS event emitted successfully");
      } else {
        console.error("❌ Socket not connected! Connected:", isConnected, "Socket:", socket);
      }

      setShowSOSConfirm(false);
      alert("🚨 SOS alert sent! Help is on the way!");
    } catch (error) {
      console.error("❌ Error sending SOS:", error);
      alert("Failed to send SOS alert. Please try again.");
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelSOS = () => {
    setShowSOSConfirm(false);
  };

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
              <img src="/black_ver.png" alt="Logo" className="w-full h-full p-0" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-6 py-2 font-bold border-4 border-black text-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${isActive(item.path)
                    ? "bg-[#FFC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-[#FFC700]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Profile/Auth */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                {/* SOS Button */}
                <button
                  type="button"
                  onClick={handleSOSClick}
                  className="px-3 py-2 font-black text-white bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  title="Emergency SOS"
                >
                  🚨
                </button>
                
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4ADE80] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-black">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">Profile</span>
                </Link>
                
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-4 py-2 bg-[#FF6B6B] border-4 border-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-[#00D9FF] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-3 py-2 bg-[#FFC700] border-4 border-black font-black text-black"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 font-bold border-4 border-black text-black ${
                  isActive(item.path)
                    ? "bg-[#FFC700]"
                    : "bg-white hover:bg-[#FFC700]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile SOS Button */}
            {session && (
              <button
                type="button"
                onClick={handleSOSClick}
                className="w-full px-4 py-3 font-black text-white bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                🚨 EMERGENCY SOS
              </button>
            )}
          </div>
        )}
      </div>

      {/* SOS Confirmation Modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md mx-4">
            <h2 className="text-2xl font-black mb-4 text-red-600">
              🚨 CONFIRM SOS ALERT 🚨
            </h2>
            <p className="mb-6 text-lg">
              This will send an emergency alert to ALL logged-in users. Are you sure you need help?
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={confirmSOS}
                disabled={isTriggering}
                className="flex-1 px-6 py-3 font-bold text-lg bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTriggering ? "SENDING..." : "YES, SEND SOS"}
              </button>
              <button
                type="button"
                onClick={cancelSOS}
                disabled={isTriggering}
                className="flex-1 px-6 py-3 font-bold text-lg bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
