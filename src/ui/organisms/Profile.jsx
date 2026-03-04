"use client"; // Ensure this component is client-side rendered

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import Loader from "../atoms/Loader";

const EditProfile = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    travelCity: "",
    travelCountry: "",
  });

  const [travelCity, setTravelCity] = useState("");
  const [travelCountry, setTravelCountry] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user data from API
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.email}/update`);
          const data = await res.json();
          setFormData({
            name: data.name,
            bio: data.bio,
            travelCity: data.travelCity,
            travelCountry: data.travelCountry,
          });
          setTravelCity(data.travelCity);
          setTravelCountry(data.travelCountry);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [status, session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      travelCity,
      travelCountry,
    });
  }, [travelCity, travelCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${session.user.email}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully");
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center p-10 m-20 mx-60 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500"
    >
      <FormField
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
      />
      <FormField
        label="Bio"
        type="text"
        placeholder="Enter your bio"
        value={formData.bio}
        onChange={handleChange}
      />
      <FormField
        label="Travel City"
        type="text"
        name="travelCity"
        placeholder="Enter your travel city"
        value={travelCity}
        onChange={(e) => setTravelCity(e.target.value)}
      />
      <FormField
        label="Travel Country"
        type="text"
        name="travelCountry"
        placeholder="Enter your travel country"
        value={travelCountry}
        onChange={(e) => setTravelCountry(e.target.value)}
      />
      <Button type="submit">Update Profile</Button>
    </form>
  );
};

export default EditProfile;
