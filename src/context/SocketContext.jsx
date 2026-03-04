"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    // Return safe defaults instead of throwing
    if (!context) {
        return { socket: null, isConnected: false, isConnecting: false };
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const connectionTimeoutRef = useRef(null);
    const hasLoggedError = useRef(false);

    useEffect(() => {
        // Use environment variable or default to current window location
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
        
        console.log("🔌 Initializing socket connection to:", socketUrl);

        // First, initialize the Socket.IO server by calling the API endpoint
        fetch('/api/socket')
            .then(() => console.log("✅ Socket.IO server endpoint called"))
            .catch(err => console.warn("⚠️ Failed to call socket endpoint:", err));

        setIsConnecting(true);

        // Wait a bit for server to initialize
        const initTimeout = setTimeout(() => {
            // Initialize socket connection
            const socketInstance = io(socketUrl, {
                path: "/api/socket",
                transports: ["polling", "websocket"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                timeout: 10000,
            });

            socketInstance.on("connect", () => {
                console.log("✅ Socket connected! ID:", socketInstance.id);
                setIsConnected(true);
                setIsConnecting(false);
                hasLoggedError.current = false;
                if (connectionTimeoutRef.current) {
                    clearTimeout(connectionTimeoutRef.current);
                }
            });

            socketInstance.on("disconnect", () => {
                console.log("❌ Socket disconnected");
                setIsConnected(false);
            });

            socketInstance.on("connect_error", (error) => {
                console.error("❌ Socket connection error:", error.message);
                setIsConnecting(false);
            });

            setSocket(socketInstance);
        }, 500);

        // Set a connection timeout
        connectionTimeoutRef.current = setTimeout(() => {
            if (!isConnected && !hasLoggedError.current) {
                console.warn("⚠️ Socket connection timeout");
                hasLoggedError.current = true;
                setIsConnecting(false);
            }
        }, 10000);

        return () => {
            clearTimeout(initTimeout);
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
            }
            if (socket) {
                console.log("🧹 Disconnecting socket");
                socket.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, isConnecting }}>
            {children}
        </SocketContext.Provider>
    );
};
