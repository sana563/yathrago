"use client";

import React, { useState, useEffect } from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const SignupForm = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { name, email, password } = formData;
  const router = useRouter();

  // Redirect user if they are already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to homepage or any other page
    }
  }, [status, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Registration successful! Logging you in...");
        
        // Auto-login after registration
        const loginRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (loginRes.ok) {
          setTimeout(() => router.push("/"), 1000);
        } else {
          setTimeout(() => router.push("/login"), 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <Texts type="heading" className="mb-2">SIGN UP</Texts>
        <div className="h-2 w-24 bg-[#4ADE80] border-4 border-black mx-auto"></div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8"
      >
        <FormField
          label="Full Name"
          type="text"
          placeholder="John Doe"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Create a strong password"
          name="password"
          value={password}
          onChange={handleChange}
        />

        {error && (
          <div className="mb-4 p-3 bg-[#FF6B6B] border-4 border-black">
            <Texts type="error" className="text-white">{error}</Texts>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-[#4ADE80] border-4 border-black">
            <Texts type="success" className="text-white">{success}</Texts>
          </div>
        )}

        <Button type="submit" name="register">
          REGISTER →
        </Button>

        <div className="mt-6 text-center">
          <Texts type="info">
            Already a member?{" "}
            <Link href="/login" className="font-black underline hover:text-[#4ADE80] transition-colors">
              Sign-In Now
            </Link>
          </Texts>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
