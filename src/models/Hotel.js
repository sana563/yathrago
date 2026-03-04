import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide hotel name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide hotel description'],
    },
    address: {
        type: String,
        required: [true, 'Please provide hotel address'],
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
    priceRange: {
        type: String,
        enum: ['Budget', 'Mid-range', 'Luxury', 'Ultra-Luxury'],
        default: 'Mid-range',
    },
    pricePerNight: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
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
    amenities: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    hotelType: {
        type: String,
        enum: ['Hotel', 'Resort', 'Boutique', 'Hostel', 'Apartment', 'Villa', 'Guesthouse'],
        default: 'Hotel',
    },
    tags: {
        type: [String],
        default: [],
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
}, {
    timestamps: true,
});

// Create indexes for better search performance
HotelSchema.index({ city: 1, country: 1 });
HotelSchema.index({ priceRange: 1 });
HotelSchema.index({ rating: -1 });
HotelSchema.index({ name: 'text', description: 'text', city: 'text', country: 'text' });

export default mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
