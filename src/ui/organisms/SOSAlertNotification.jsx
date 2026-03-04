"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

const SOSAlertNotification = () => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [alerts, setAlerts] = useState([]);

  const playSOSSound = () => {
    // Create audio alert (you can replace with actual audio file)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (error) {
      console.log("Audio not available");
    }
  };

  const handleSOSAlert = useCallback((data) => {
    console.log("📥 RAW SOS Alert received:", data);
    console.log("👤 Current user email:", session?.user?.email);
    console.log("📧 Alert from email:", data.userEmail);
    
    // Don't show alert to the user who triggered it
    if (session?.user?.email === data.userEmail) {
      console.log("⏭️ Skipping - this is my own alert");
      return;
    }

    console.log("✅ Displaying SOS Alert:", data);

    // Add new alert
    setAlerts((prev) => {
      // Check if alert already exists
      if (prev.some((alert) => alert.alertId === data.alertId)) {
        console.log("⚠️ Alert already exists, skipping");
        return prev;
      }
      console.log("➕ Adding new alert to state");
      return [...prev, { ...data, id: Date.now() }];
    });

    // Play sound
    playSOSSound();

    // Auto-remove after 30 seconds
    setTimeout(() => {
      console.log("⏰ Auto-dismissing alert after 30s:", data.alertId);
      setAlerts((prev) => prev.filter((alert) => alert.alertId !== data.alertId));
    }, 30000);
  }, [session]);

  const handleSOSResolved = useCallback((data) => {
    console.log("✅ SOS Resolved:", data);
    setAlerts((prev) => prev.filter((alert) => alert.alertId !== data.alertId));
  }, []);

  useEffect(() => {
    console.log("🔌 SOSAlertNotification: Socket connected:", isConnected, "Socket:", socket);
    
    if (socket && isConnected) {
      console.log("✅ SOSAlertNotification: Registering socket listeners");
      
      socket.on("sos-alert", handleSOSAlert);
      socket.on("sos-resolved", handleSOSResolved);

      // Test listener
      socket.on("connect", () => {
        console.log("🔌 Socket reconnected in SOSAlertNotification");
      });

      return () => {
        console.log("🧹 SOSAlertNotification: Cleaning up socket listeners");
        socket.off("sos-alert", handleSOSAlert);
        socket.off("sos-resolved", handleSOSResolved);
        socket.off("connect");
      };
    } else {
      console.log("⚠️ SOSAlertNotification: Socket not ready");
    }
  }, [socket, isConnected, handleSOSAlert, handleSOSResolved]);

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.alertId !== alertId));
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-4 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-red-600 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              <h3 className="text-xl font-black">EMERGENCY SOS ALERT!</h3>
            </div>
            <button
              onClick={() => dismissAlert(alert.alertId)}
              className="text-white hover:text-gray-200 text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-white text-black p-3 border-2 border-black">
              <p className="font-bold text-lg">{alert.userName}</p>
              <p className="text-sm opacity-80">{alert.userEmail}</p>
              {alert.userLocation?.travelCity && (
                <p className="text-sm mt-1">
                  📍 {alert.userLocation.travelCity}
                  {alert.userLocation.travelCountry && `, ${alert.userLocation.travelCountry}`}
                </p>
              )}
            </div>

            <p className="text-white font-bold text-center py-2">
              {alert.message}
            </p>

            <div className="flex gap-2">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${alert.userEmail}&su=Emergency%20Response%20-%20SOS%20Alert&body=Hi%20${alert.userName},%0D%0A%0D%0AI%20saw%20your%20SOS%20alert.%20How%20can%20I%20help%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-white text-red-600 font-bold text-center border-2 border-black hover:bg-gray-100 transition-colors"
              >
                📧 Email
              </a>
              <a
                href={`/chats/new?userId=${alert.userId}`}
                className="flex-1 px-4 py-2 bg-white text-red-600 font-bold text-center border-2 border-black hover:bg-gray-100 transition-colors"
              >
                💬 Chat
              </a>
            </div>
          </div>

          <p className="text-xs text-center mt-2 opacity-75">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SOSAlertNotification;
