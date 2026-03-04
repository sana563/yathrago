import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide activity name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide activity description'],
    },
    location: {
        type: String,
        required: [true, 'Please provide location'],
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
    category: {
        type: String,
        enum: ['Adventure', 'Cultural', 'Nature', 'Historical', 'Entertainment', 'Sports', 'Wellness', 'Food & Drink'],
        required: true,
    },
    duration: {
        value: { type: Number, required: true },
        unit: { type: String, enum: ['hours', 'days', 'minutes'], default: 'hours' },
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging', 'Expert'],
        default: 'Easy',
    },
    priceRange: {
        type: String,
        enum: ['Free', 'Budget', 'Mid-range', 'Expensive'],
        default: 'Mid-range',
    },
    price: {
        amount: { type: Number, default: 0 },
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
    images: {
        type: [String],
        default: [],
    },
    bestTimeToVisit: {
        type: [String],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    includedInPrice: {
        type: [String],
        default: [],
    },
    whatToBring: {
        type: [String],
        default: [],
    },
    ageRestriction: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
    },
    groupSize: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 50 },
    },
    bookingRequired: {
        type: Boolean,
        default: false,
    },
    website: {
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
ActivitySchema.index({ city: 1, country: 1 });
ActivitySchema.index({ category: 1 });
ActivitySchema.index({ rating: -1 });
ActivitySchema.index({ name: 'text', description: 'text', location: 'text', city: 'text', country: 'text' });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
