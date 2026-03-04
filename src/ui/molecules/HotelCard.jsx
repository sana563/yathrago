import React from "react";

const HotelCard = ({ hotel, onClick }) => {
  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div 
      onClick={onClick}
      className="group h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden cursor-pointer"
    >
        {/* Image */}
        <div
          className="h-48 relative overflow-hidden border-b-4 border-black"
          style={{ backgroundColor: randomColor }}
        >
          {hotel.images && hotel.images[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🏨
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {hotel.priceRange}
          </div>

          {/* Rating */}
          {hotel.rating > 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#FFC700] border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⭐ {hotel.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-[#00D9FF] transition-colors">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-2 mb-2 text-sm font-bold">
            <span>📍</span>
            <span className="line-clamp-1">{hotel.city}, {hotel.country}</span>
          </div>

          {hotel.hotelType && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-[#4ADE80] border-2 border-black font-bold text-xs">
                {hotel.hotelType}
              </span>
            </div>
          )}

          <p className="text-sm font-medium text-black line-clamp-3 mb-3">
            {hotel.description}
          </p>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 border-2 border-black text-xs font-bold"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 border-2 border-black text-xs font-bold">
                  +{hotel.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price Range */}
          {hotel.pricePerNight && hotel.pricePerNight.min > 0 && (
            <div className="pt-3 border-t-2 border-black">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">From</span>
                <span className="text-xl font-black">
                  {hotel.pricePerNight.currency} {hotel.pricePerNight.min}
                  <span className="text-sm">/night</span>
                </span>
              </div>
            </div>
          )}

          {/* Reviews */}
          {hotel.reviewCount > 0 && (
            <div className="text-xs font-medium text-black mt-2">
              {hotel.reviewCount} reviews
            </div>
          )}
        </div>
      </div>
  );
};

export default HotelCard;
