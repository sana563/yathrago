"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";
import Provider from "@/context/Provider";

const DestinationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4", "#00CED1"];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!params.id) return;

      try {
        const response = await fetch(`/api/destinations/${params.id}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch destination");
        }

        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error("Error fetching destination:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [params.id]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white">
        <MainNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-9xl mb-6">🚫</div>
          <h1 className="text-5xl font-black mb-4 uppercase text-black">Destination Not Found</h1>
          <p className="text-xl font-medium text-black mb-8">
            The destination you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/trip-advisor"
            className="inline-block px-8 py-4 bg-black border-4 border-black text-white font-black text-xl hover:bg-gray-800 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            ← Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!destination) return null;

  // Get a color for this destination based on its index or use first color
  const destinationColor = colors[0];

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/trip-advisor"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-bold text-black hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
        >
          ← Back to Destinations
        </Link>
      </div>

      {/* Hero Header */}
      <div
        className="py-20 border-y-8 border-black"
        style={{ backgroundColor: destinationColor }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase text-black">
            {destination.name}
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-white border-3 border-black font-black text-sm text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {destination.category}
            </span>
            {destination.continent && (
              <span className="px-4 py-2 bg-white border-3 border-black font-black text-sm text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                📍 {destination.continent}
              </span>
            )}
            {destination.expense && (
              <span className="px-4 py-2 bg-white border-3 border-black font-black text-sm text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                💰 {destination.expense}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* About Section */}
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-6 uppercase bg-[#4ADE80] inline-block px-4 py-2 border-3 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              About
            </h2>
            <p className="text-xl font-medium leading-relaxed text-black">
              {destination.details}
            </p>
          </section>

          {/* Images Grid (if available) */}
          {destination.images && destination.images.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.images.slice(0, 4).map((image, i) => (
                <div
                  key={i}
                  className="h-64 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${destination.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </section>
          )}

          {/* Packing List */}
          {destination.packingList && destination.packingList.length > 0 && (
            <section className="bg-[#FFC700]/10 border-4 border-[#FFC700] p-8 shadow-[8px_8px_0px_0px_rgba(255,199,0,1)]">
              <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-3 text-black">
                <span className="text-4xl">🎒</span> Packing List
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.packingList.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-black bg-white p-3 border-2 border-black">
                    <span className="w-6 h-6 border-2 border-black flex items-center justify-center text-xs bg-[#FFC700] text-black flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Things to Do */}
          {destination.whatToDo && destination.whatToDo.length > 0 && (
            <section className="bg-[#00D9FF]/10 border-4 border-[#00D9FF] p-8 shadow-[8px_8px_0px_0px_rgba(0,217,255,1)]">
              <h2 className="text-3xl font-black mb-6 uppercase flex items-center gap-3 text-black">
                <span className="text-4xl">🎭</span> Things to Do
              </h2>
              <div className="space-y-4">
                {destination.whatToDo.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#00D9FF] border-2 border-black font-black text-xl text-black">
                      {i + 1}
                    </span>
                    <span className="font-bold text-lg text-black pt-1">{activity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {destination.tags && destination.tags.length > 0 && (
            <section className="flex flex-wrap gap-3">
              {destination.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white border-2 border-black font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  #{tag}
                </span>
              ))}
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
            <h3 className="text-3xl font-black mb-4 text-white">Ready to explore {destination.name}?</h3>
            <p className="text-lg font-medium mb-6 text-white">
              Find travel companions who want to visit this destination!
            </p>
            <Link
              href="/discover"
              className="inline-block px-8 py-4 bg-[#4ADE80] text-black border-3 border-black font-black text-xl hover:bg-[#22C55E] transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              Find Companion →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default function DestinationDetail() {
  return (
    <Provider>
      <DestinationDetailPage />
    </Provider>
  );
}
