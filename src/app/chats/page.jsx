"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";

const ChatsHomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to chatrooms page as this is the new home for community chats
    router.replace("/chatrooms");
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFA]">
      <Loader />
    </div>
  );
};

export default ChatsHomePage;
