import React from "react";

const TravelStoryCard = ({ story, onClick }) => {
  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      onClick={onClick}
      className="group h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden cursor-pointer"
    >
        {/* Cover Image */}
        <div
          className="h-56 relative overflow-hidden border-b-4 border-black"
          style={{ backgroundColor: randomColor }}
        >
          {story.coverImage || (story.images && story.images[0]) ? (
            <img
              src={story.coverImage || story.images[0]}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              ✈️
            </div>
          )}
          
          {/* Featured Badge */}
          {story.featured && (
            <div className="absolute top-3 right-3 px-3 py-2 bg-[#FFC700] border-3 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⭐ FEATURED
            </div>
          )}

          {/* Trip Type */}
          {story.tripType && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white border-3 border-black font-bold text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {story.tripType}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Author Info */}
          {story.author && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#00D9FF] border-2 border-black rounded-full flex items-center justify-center font-black text-sm">
                {story.author.avatar ? (
                  <img 
                    src={story.author.avatar} 
                    alt={story.author.name || 'Author'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (story.author.name?.[0] || 'T').toUpperCase()
                )}
              </div>
              <div>
                <div className="font-bold text-sm">{story.author.name || 'Anonymous'}</div>
                <div className="font-medium text-xs text-black">
                  {story.createdAt && formatDate(story.createdAt)}
                </div>
              </div>
            </div>
          )}

          <h3 className="text-xl font-black mb-2 line-clamp-2 group-hover:text-[#FFC700] transition-colors">
            {story.title}
          </h3>

          {/* Destinations */}
          {story.countries && story.countries.length > 0 && (
            <div className="flex items-center gap-2 mb-3 text-sm font-bold">
              <span>📍</span>
              <span className="line-clamp-1">
                {story.countries.slice(0, 2).join(', ')}
                {story.countries.length > 2 && ` +${story.countries.length - 2}`}
              </span>
            </div>
          )}

          {/* Excerpt */}
          <p className="text-sm font-medium text-black line-clamp-3 mb-3">
            {story.excerpt || (story.content ? story.content.substring(0, 150) + '...' : 'No description available')}
          </p>

          {/* Categories */}
          {story.categories && story.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {story.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#4ADE80] border-2 border-black text-xs font-bold"
                >
                  {category}
                </span>
              ))}
              {story.categories.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 border-2 border-black text-xs font-bold">
                  +{story.categories.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-between text-sm font-bold">
            <div className="flex gap-3">
              {story.likes !== undefined && story.likes > 0 && (
                <span className="flex items-center gap-1">
                  ❤️ {story.likes}
                </span>
              )}
              {story.views !== undefined && story.views > 0 && (
                <span className="flex items-center gap-1">
                  👁️ {story.views}
                </span>
              )}
            </div>
            
            {story.rating && story.rating > 0 && (
              <span className="flex items-center gap-1">
                ⭐ {story.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Trip Duration */}
          {story.tripDuration && story.tripDuration.value && (
            <div className="mt-2 text-xs font-medium text-black">
              🕒 {story.tripDuration.value} {story.tripDuration.unit} trip
            </div>
          )}
        </div>
      </div>
  );
};

export default TravelStoryCard;
