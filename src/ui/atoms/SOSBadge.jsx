"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

const SOSBadge = () => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [isTriggering, setIsTriggering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSOSClick = () => {
    if (!session?.user) {
      alert("You must be logged in to send an SOS alert.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSOS = async () => {
    setIsTriggering(true);

    try {
      // Save to database
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

      // Broadcast via socket to all connected users
      if (socket && isConnected) {
        socket.emit("trigger-sos", {
          alertId: data.alert._id,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userLocation: {
            travelCity: session.user.travelCity || "",
            travelCountry: session.user.travelCountry || "",
          },
          message: data.alert.message,
        });
      }

      setShowConfirm(false);
      alert("🚨 SOS alert sent! Help is on the way!");
    } catch (error) {
      console.error("Error sending SOS:", error);
      alert("Failed to send SOS alert. Please try again.");
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelSOS = () => {
    setShowConfirm(false);
  };

  // Only show if user is logged in
  if (!session?.user) {
    return null;
  }

  return (
    <>
      {/* SOS Badge - Fixed position next to chat button */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-8 right-24 z-50 w-14 h-14 bg-red-600 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center text-2xl font-black text-white cursor-pointer animate-pulse"
        title="Emergency SOS - Send alert to all users"
      >
        🚨
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
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
                onClick={confirmSOS}
                disabled={isTriggering}
                className="flex-1 px-6 py-3 font-bold text-lg bg-red-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTriggering ? "SENDING..." : "YES, SEND SOS"}
              </button>
              <button
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
    </>
  );
};

export default SOSBadge;
