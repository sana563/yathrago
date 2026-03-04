"use client";
import React, { useState, useEffect, useMemo } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const ProfilePageContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    travelCity: "",
    travelCountry: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session.user.email}/update`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          travelCity: data.travelCity || "",
          travelCountry: data.travelCountry || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/users/${session.user.email}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully! ✅");
        setIsEditing(false);
        fetchUserData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#8B5CF6", "#F97316"];

  const avatarColor = useMemo(() => {
    if (!isMounted || !formData.name) return "#CCCCCC";
    return colors[(formData.name.length || 0) % colors.length];
  }, [formData.name, isMounted]);

  if (status === "loading" || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-[#FF6B6B] via-[#FFC700] to-[#4ADE80] border-b-4 border-black h-48">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt={formData.name}
              className="w-32 h-32 border-8 border-black rounded-full object-cover bg-white"
            />
          ) : (
            <div
              className="w-32 h-32 border-8 border-black rounded-full flex items-center justify-center font-black text-6xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]]"
              style={{ backgroundColor: avatarColor }}
            >
              {formData.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
      </section>

      {/* Profile Content */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* View Mode */}
        {!isEditing ? (
          <div>
            {/* Name & Edit Button */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black mb-2 uppercase text-black">{formData.name}</h1>
              <p className="text-gray-800 font-bold">{session?.user?.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 px-8 py-3 bg-[#FFC700] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Bio Card */}
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
                <h2 className="text-2xl font-black mb-4 uppercase flex items-center gap-2 text-black">
                  <span>📝</span> Bio
                </h2>
                <p className="font-medium text-lg text-black">
                  {formData.bio || "No bio added yet. Tell others about yourself!"}
                </p>
              </div>

              {/* Travel Info Card */}
              <div className="bg-[#00D9FF] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
                <h2 className="text-2xl font-black mb-4 uppercase flex items-center gap-2 text-black">
                  <span>✈️</span> Travel Plans
                </h2>
                {formData.travelCity || formData.travelCountry ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="font-black text-xl text-black">
                          {formData.travelCity}
                          {formData.travelCity && formData.travelCountry && ", "}
                          {formData.travelCountry}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="font-medium text-black">
                    No travel plans set. Add your destination to connect with others!
                  </p>
                )}
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#FF6B6B] border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-3xl font-black text-black">{formData.chats?.length || 0}</p>
                  <p className="font-bold text-black">Chats</p>
                </div>
                <div className="bg-[#4ADE80] border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                  <div className="text-4xl mb-2">🌍</div>
                  <p className="text-3xl font-black text-black">1</p>
                  <p className="font-bold text-black">Destinations</p>
                </div>
                <div className="bg-[#FFC700] border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="text-3xl font-black text-black">0</p>
                  <p className="font-bold text-black">Friends</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Link
                  href="/discover"
                  className="p-6 bg-white border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-xl font-black mb-1">Find Companions</h3>
                  <p className="font-medium text-gray-600">Discover travelers</p>
                </Link>
                <Link
                  href="/chats"
                  className="p-6 bg-white border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  <div className="text-4xl mb-2">💬</div>
                  <h3 className="text-xl font-black mb-1">My Chats</h3>
                  <p className="font-medium text-gray-600">View conversations</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div>
            <h2 className="text-4xl font-black mb-8 text-center uppercase">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="bg-white border-4 border-black p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-lg font-black mb-3 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Bio Field */}
              <div className="bg-white border-4 border-black p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-lg font-black mb-3 uppercase">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border-4 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Travel Info */}
              <div className="bg-[#00D9FF] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black mb-4 uppercase">Travel Plans</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-black mb-2 uppercase">City</label>
                    <input
                      type="text"
                      name="travelCity"
                      value={formData.travelCity}
                      onChange={handleChange}
                      placeholder="e.g., Tokyo"
                      className="w-full px-4 py-3 border-4 border-black font-medium bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-black mb-2 uppercase">Country</label>
                    <input
                      type="text"
                      name="travelCountry"
                      value={formData.travelCountry}
                      onChange={handleChange}
                      placeholder="e.g., Japan"
                      className="w-full px-4 py-3 border-4 border-black font-medium bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-lg text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes ✓"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserData();
                  }}
                  className="px-8 py-4 bg-[#FF6B6B] border-4 border-black font-black text-lg text-white hover:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default function NewProfilePage() {
  return (
    <Provider>
      <ProfilePageContent />
    </Provider>
  );
}
