"use client";
import React, { useEffect } from "react";

const DetailModal = ({ isOpen, onClose, item, type }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const renderHotelDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover border-4 border-black"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-black text-lg mb-2">Location</h4>
          <p className="font-medium">📍 {item.address}</p>
          <p className="font-medium">{item.city}, {item.country}</p>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Price Range</h4>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-[#FFC700] border-3 border-black font-black">
              {item.priceRange}
            </span>
            {item.pricePerNight && (
              <span className="text-xl font-black">
                ${item.pricePerNight.min} - ${item.pricePerNight.max} / night
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Rating & Reviews</h4>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-[#4ADE80] border-3 border-black font-black text-lg">
              ⭐ {item.rating?.toFixed(1)}
            </span>
            <span className="font-medium">{item.reviewCount} reviews</span>
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {item.amenities?.map((amenity, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border-2 border-black font-bold text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {item.website && (
          <div>
            <h4 className="font-black text-lg mb-2">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-bold hover:text-blue-800"
            >
              Visit Website
            </a>
          </div>
        )}

        {item.phone && (
          <div>
            <h4 className="font-black text-lg mb-2">Phone</h4>
            <p className="font-bold">📞 {item.phone}</p>
          </div>
        )}
      </div>
    </>
  );

  const renderActivityDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover border-4 border-black"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-black text-lg mb-2">Location</h4>
          <p className="font-medium">📍 {item.location}</p>
          <p className="font-medium">{item.city}, {item.country}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-black text-sm mb-1">Category</h4>
            <span className="px-3 py-1 bg-[#00D9FF] border-2 border-black font-bold text-sm">
              {item.category}
            </span>
          </div>
          <div>
            <h4 className="font-black text-sm mb-1">Difficulty</h4>
            <span className="px-3 py-1 bg-[#FF6B6B] border-2 border-black font-bold text-sm">
              {item.difficulty}
            </span>
          </div>
          <div>
            <h4 className="font-black text-sm mb-1">Duration</h4>
            <span className="px-3 py-1 bg-[#4ADE80] border-2 border-black font-bold text-sm">
              {item.duration?.value} {item.duration?.unit}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Price</h4>
          <span className="text-2xl font-black">
            ${item.price?.amount} {item.price?.currency}
          </span>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">What's Included</h4>
          <ul className="list-disc list-inside space-y-1">
            {item.includedInPrice?.map((inc, idx) => (
              <li key={idx} className="font-medium">{inc}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">What to Bring</h4>
          <div className="flex flex-wrap gap-2">
            {item.whatToBring?.map((thing, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border-2 border-black font-medium text-sm"
              >
                {thing}
              </span>
            ))}
          </div>
        </div>

        {item.ageRestriction && (
          <div>
            <h4 className="font-black text-lg mb-2">Age Restriction</h4>
            <p className="font-medium">
              {item.ageRestriction.min} - {item.ageRestriction.max} years
            </p>
          </div>
        )}

        {item.website && (
          <div>
            <h4 className="font-black text-lg mb-2">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-bold hover:text-blue-800"
            >
              Book Now
            </a>
          </div>
        )}
      </div>
    </>
  );

  const renderRestaurantDetails = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {item.images && item.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={item.name}
            className="w-full h-64 object-cover border-4 border-black"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-black text-lg mb-2">Location</h4>
          <p className="font-medium">📍 {item.address}</p>
          <p className="font-medium">{item.city}, {item.country}</p>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Cuisine</h4>
          <div className="flex flex-wrap gap-2">
            {item.cuisine?.map((c, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#FF6B6B] border-2 border-black font-bold text-black"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Average Cost</h4>
          <span className="text-2xl font-black">
            {item.averageCost?.currency} {item.averageCost?.amount}
            {item.averageCost?.perPerson && " / person"}
          </span>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Dietary Options</h4>
          <div className="flex flex-wrap gap-2">
            {item.dietaryOptions?.map((option, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#4ADE80] border-2 border-black font-bold text-sm"
              >
                {option}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Specialties</h4>
          <ul className="list-disc list-inside space-y-1">
            {item.specialties?.map((spec, idx) => (
              <li key={idx} className="font-medium">{spec}</li>
            ))}
          </ul>
        </div>

        {item.openingHours && (
          <div>
            <h4 className="font-black text-lg mb-2">Opening Hours</h4>
            <p className="font-medium">🕒 {item.openingHours}</p>
          </div>
        )}

        {item.website && (
          <div>
            <h4 className="font-black text-lg mb-2">Website</h4>
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-bold hover:text-blue-800"
            >
              Visit Website
            </a>
          </div>
        )}

        {item.phone && (
          <div>
            <h4 className="font-black text-lg mb-2">Phone</h4>
            <p className="font-bold">📞 {item.phone}</p>
          </div>
        )}

        {item.reservationRequired && (
          <div className="p-4 bg-[#FFC700] border-3 border-black">
            <p className="font-black">⚠️ Reservation Required</p>
          </div>
        )}
      </div>
    </>
  );

  const renderStoryDetails = () => (
    <>
      {item.coverImage && (
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-96 object-cover border-4 border-black mb-6"
        />
      )}

      <div className="space-y-4">
        {item.author && (
          <div className="flex items-center gap-3 p-4 bg-[#00D9FF] border-3 border-black">
            <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center font-black">
              {item.author.avatar ? (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (item.author.name?.[0] || 'T').toUpperCase()
              )}
            </div>
            <div>
              <p className="font-black">{item.author.name || 'Anonymous'}</p>
              <p className="text-sm font-medium">{item.author.email}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-black text-lg mb-2">Destinations</h4>
          <div className="flex flex-wrap gap-2">
            {item.countries?.map((country, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#4ADE80] border-2 border-black font-bold"
              >
                📍 {country}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Trip Details</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {item.tripType && (
              <span className="px-3 py-2 bg-white border-2 border-black font-bold text-center">
                {item.tripType}
              </span>
            )}
            {item.tripDuration && (
              <span className="px-3 py-2 bg-white border-2 border-black font-bold text-center">
                🕒 {item.tripDuration.value} {item.tripDuration.unit}
              </span>
            )}
            {item.budget?.amount && (
              <span className="px-3 py-2 bg-white border-2 border-black font-bold text-center">
                💰 ${item.budget.amount}
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-black text-lg mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {item.categories?.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#FF6B6B] border-2 border-black font-bold text-black"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {item.excerpt && (
          <div>
            <h4 className="font-black text-lg mb-2">Summary</h4>
            <p className="font-medium text-black leading-relaxed">{item.excerpt}</p>
          </div>
        )}

        {item.tips && item.tips.length > 0 && (
          <div>
            <h4 className="font-black text-lg mb-2">💡 Tips</h4>
            <ul className="list-disc list-inside space-y-1">
              {item.tips.map((tip, idx) => (
                <li key={idx} className="font-medium">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <div>
            <h4 className="font-black text-lg mb-2">✨ Highlights</h4>
            <ul className="list-disc list-inside space-y-1">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="font-medium">{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-gray-100 border-2 border-black">
          {item.likes !== undefined && (
            <span className="font-bold">❤️ {item.likes} likes</span>
          )}
          {item.views !== undefined && (
            <span className="font-bold">👁️ {item.views} views</span>
          )}
          {item.rating && (
            <span className="font-bold">⭐ {item.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFC700] border-b-4 border-black p-6 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-black mb-2 uppercase">{item.name || item.title}</h2>
            {item.city && item.country && (
              <p className="text-lg font-bold">
                📍 {item.city}, {item.country}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FF6B6B] border-3 border-black font-black text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <p className="text-base font-medium text-black leading-relaxed">
              {item.description || item.content}
            </p>
          </div>

          {type === "hotels" && renderHotelDetails()}
          {type === "activities" && renderActivityDetails()}
          {type === "restaurants" && renderRestaurantDetails()}
          {type === "stories" && renderStoryDetails()}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
