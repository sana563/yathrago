import React from "react";

const ActivityCard = ({ activity, onClick }) => {
  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const categoryEmojis = {
    'Adventure': '🏔️',
    'Cultural': '🎭',
    'Nature': '🌿',
    'Historical': '🏛️',
    'Entertainment': '🎪',
    'Sports': '⚽',
    'Wellness': '🧘',
    'Food & Drink': '🍷'
  };

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
          {activity.images && activity.images[0] ? (
            <img
              src={activity.images[0]}
              alt={activity.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {categoryEmojis[activity.category] || '🎭'}
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {activity.category}
          </div>

          {/* Rating */}
          {activity.rating > 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#FFC700] border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⭐ {activity.rating.toFixed(1)}
            </div>
          )}

          {/* Difficulty */}
          {activity.difficulty && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-[#FF6B6B] border-3 border-black font-black text-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {activity.difficulty}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-[#4ADE80] transition-colors">
            {activity.name}
          </h3>

          <div className="flex items-center gap-2 mb-2 text-sm font-bold">
            <span>📍</span>
            <span className="line-clamp-1">{activity.city}, {activity.country}</span>
          </div>

          {/* Duration */}
          {activity.duration && (
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-[#00D9FF] border-2 border-black font-bold text-xs">
                ⏱️ {activity.duration.value} {activity.duration.unit}
              </span>
              {activity.priceRange && (
                <span className="inline-block px-3 py-1 bg-[#FFC700] border-2 border-black font-bold text-xs">
                  {activity.priceRange}
                </span>
              )}
            </div>
          )}

          <p className="text-sm font-medium text-black line-clamp-3 mb-3">
            {activity.description}
          </p>

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {activity.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 border-2 border-black text-xs font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Price and Reviews */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-between">
            {activity.price && activity.price.amount > 0 ? (
              <span className="text-lg font-black">
                {activity.price.currency} {activity.price.amount}
              </span>
            ) : (
              <span className="text-lg font-black text-[#4ADE80]">
                {activity.priceRange === 'Free' ? 'FREE' : 'Varies'}
              </span>
            )}
            
            {activity.reviewCount > 0 && (
              <span className="text-xs font-medium text-black">
                {activity.reviewCount} reviews
              </span>
            )}
          </div>
        </div>
      </div>
  );
};

export default ActivityCard;
