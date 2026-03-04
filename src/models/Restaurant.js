import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide restaurant name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide restaurant description'],
    },
    address: {
        type: String,
        required: [true, 'Please provide restaurant address'],
    },
    city: {
        type: String,
        required: [true, 'Please provide city'],
    },
    country: {
        type: String,
        required: [true, 'Please provide country'],
    },
    continent: {
        type: String,
        enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'],
        required: true,
    },
    cuisine: {
        type: [String],
        required: [true, 'Please provide at least one cuisine type'],
        default: [],
    },
    priceRange: {
        type: String,
        enum: ['Budget', 'Mid-range', 'Fine Dining', 'Luxury'],
        default: 'Mid-range',
    },
    averageCost: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        perPerson: { type: Boolean, default: true },
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    restaurantType: {
        type: String,
        enum: ['Restaurant', 'Café', 'Bar', 'Bistro', 'Fast Food', 'Street Food', 'Food Truck', 'Fine Dining'],
        default: 'Restaurant',
    },
    mealTypes: {
        type: [String],
        enum: ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late Night'],
        default: [],
    },
    dietaryOptions: {
        type: [String],
        enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Organic', 'Lactose-Free'],
        default: [],
    },
    features: {
        type: [String],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    openingHours: {
        type: String,
        default: '',
    },
    reservationRequired: {
        type: Boolean,
        default: false,
    },
    website: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    specialties: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

// Create indexes for better search performance
RestaurantSchema.index({ city: 1, country: 1 });
RestaurantSchema.index({ cuisine: 1 });
RestaurantSchema.index({ priceRange: 1 });
RestaurantSchema.index({ rating: -1 });
RestaurantSchema.index({ name: 'text', description: 'text', city: 'text', country: 'text', cuisine: 'text' });

export default mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);
