"use client";
import Provider from "@/context/Provider";
import Loader from "@/ui/atoms/Loader";
import ChatPage from "@/ui/templates/ChatPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to the login page if the user is not authenticated
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />; // Show a loading state while checking the session
  }
  console.log(session);
  return (
    <Provider>
      <ChatPage type="chats" />

      {/* <GroupChat /> */}
    </Provider>
  );
}
