"use client";
import NewProfilePage from "@/ui/templates/NewProfilePage";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to the home page if the user is not authenticated
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />; // Show a loading state while checking the session
  }

  return <NewProfilePage />;
};

export default Profile;
