"use client";

import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketContext";

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </SessionProvider>
  );
};

export default Provider;
