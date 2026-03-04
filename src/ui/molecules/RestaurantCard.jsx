import React from "react";

const RestaurantCard = ({ restaurant, onClick }) => {
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
          {restaurant.images && restaurant.images[0] ? (
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {restaurant.priceRange}
          </div>

          {/* Rating */}
          {restaurant.rating > 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#FFC700] border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⭐ {restaurant.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-[#FF6B6B] transition-colors">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-2 mb-2 text-sm font-bold">
            <span>📍</span>
            <span className="line-clamp-1">{restaurant.city}, {restaurant.country}</span>
          </div>

          {/* Cuisine Tags */}
          {restaurant.cuisine && restaurant.cuisine.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {restaurant.cuisine.slice(0, 3).map((c, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#FF6B6B] border-2 border-black font-bold text-black text-xs"
                >
                  {c}
                </span>
              ))}
              {restaurant.cuisine.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 border-2 border-black font-bold text-xs">
                  +{restaurant.cuisine.length - 3}
                </span>
              )}
            </div>
          )}

          <p className="text-sm font-medium text-black line-clamp-3 mb-3">
            {restaurant.description}
          </p>

          {/* Dietary Options */}
          {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {restaurant.dietaryOptions.slice(0, 3).map((option, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#4ADE80] border-2 border-black text-xs font-bold"
                >
                  {option}
                </span>
              ))}
            </div>
          )}

          {/* Price and Type */}
          <div className="pt-3 border-t-2 border-black">
            <div className="flex items-center justify-between mb-2">
              {restaurant.averageCost && restaurant.averageCost.amount > 0 ? (
                <span className="text-lg font-black">
                  {restaurant.averageCost.currency} {restaurant.averageCost.amount}
                  {restaurant.averageCost.perPerson && <span className="text-sm">/person</span>}
                </span>
              ) : (
                <span className="text-sm font-bold">{restaurant.priceRange}</span>
              )}
            </div>

            {restaurant.restaurantType && (
              <span className="inline-block px-2 py-1 bg-gray-100 border-2 border-black text-xs font-bold">
                {restaurant.restaurantType}
              </span>
            )}

            {/* Reviews */}
            {restaurant.reviewCount > 0 && (
              <div className="text-xs font-medium text-black mt-2">
                {restaurant.reviewCount} reviews
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default RestaurantCard;
