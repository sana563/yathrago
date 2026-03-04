"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/ui/atoms/Loader";
import Provider from "@/context/Provider";

const NewChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && userId && session?.user?.id) {
      createOrFindChat();
    }
  }, [status, userId, session]);

  const createOrFindChat = async () => {
    try {
      // Create new chat with the selected user
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserID: session.user.id,
          members: [session.user.id, userId],
          isGroupChat: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      console.log("Chat created/found:", data);

      // Handle both new chat and existing chat responses
      let chatId;
      if (data.chat?._id) {
        // Existing chat case
        chatId = data.chat._id;
      } else if (data._id) {
        // New chat case
        chatId = data._id;
      }

      if (chatId) {
        router.push(`/chats/${chatId}`);
      } else {
        throw new Error("No chat ID returned");
      }
    } catch (error) {
      console.error("Error creating/finding chat:", error);
      // Redirect back to discover page on error
      router.push("/discover");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-lg font-bold text-black">Starting conversation...</p>
      </div>
    </div>
  );
};

export default function NewChat() {
  return (
    <Provider>
      <Suspense fallback={<Loader />}>
        <NewChatPage />
      </Suspense>
    </Provider>
  );
}
