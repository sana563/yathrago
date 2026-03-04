"use client";
import Provider from "@/context/Provider";
import HomePage from "@/ui/templates/HomePage";

export default function Home() {
  return (
    <Provider>
      <HomePage />
    </Provider>
  );
}
