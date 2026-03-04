// LoginForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect user if they are already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to homepage or any other page
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("SignIn Response:", res); // Log the response for debugging

    if (res.ok) {
      router.push("/");
    } else {
      const errorMsg = res.error || "Failed to login";
      setError(errorMsg);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <Texts type="heading" className="mb-2">LOGIN</Texts>
        <div className="h-2 w-24 bg-[#00D9FF] border-4 border-black mx-auto"></div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8"
      >
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="mb-4 p-3 bg-[#FF6B6B] border-4 border-black">
            <Texts type="error" className="text-white">{error}</Texts>
          </div>
        )}

        <Button type="submit" name="login" aria-label="Login Button">
          LOGIN →
        </Button>

        <div className="mt-6 text-center">
          <Texts type="info">
            Not a user?{" "}
            <Link href="/register" className="font-black underline hover:text-[#00D9FF] transition-colors">
              Sign-Up Now
            </Link>
          </Texts>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
