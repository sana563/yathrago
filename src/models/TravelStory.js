import mongoose from 'mongoose';

const TravelStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide story title'],
        maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide story content'],
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    author: {
        name: { type: String, required: true },
        email: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        avatar: { type: String, default: '' },
        bio: { type: String, default: '' },
    },
    destinations: {
        type: [String],
        required: [true, 'Please provide at least one destination'],
        default: [],
    },
    cities: {
        type: [String],
        default: [],
    },
    countries: {
        type: [String],
        required: [true, 'Please provide at least one country'],
        default: [],
    },
    continents: {
        type: [String],
        enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'],
        default: [],
    },
    tripDuration: {
        value: { type: Number },
        unit: { type: String, enum: ['days', 'weeks', 'months', 'years'], default: 'days' },
    },
    travelDate: {
        start: { type: Date },
        end: { type: Date },
    },
    tripType: {
        type: String,
        enum: ['Solo', 'Couple', 'Family', 'Friends', 'Group Tour', 'Business'],
        default: 'Solo',
    },
    categories: {
        type: [String],
        enum: ['Adventure', 'Cultural', 'Nature', 'Food', 'Luxury', 'Budget', 'Backpacking', 'Road Trip', 'City Break', 'Beach', 'Mountains'],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    coverImage: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    budget: {
        amount: { type: Number },
        currency: { type: String, default: 'USD' },
        breakdown: { type: String },
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
    }],
    tips: {
        type: [String],
        default: [],
    },
    highlights: {
        type: [String],
        default: [],
    },
    challenges: {
        type: [String],
        default: [],
    },
    wouldRecommend: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    published: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Create indexes for better search performance
TravelStorySchema.index({ countries: 1 });
TravelStorySchema.index({ categories: 1 });
TravelStorySchema.index({ rating: -1 });
TravelStorySchema.index({ likes: -1 });
TravelStorySchema.index({ views: -1 });
TravelStorySchema.index({ createdAt: -1 });
TravelStorySchema.index({ title: 'text', content: 'text', destinations: 'text', countries: 'text', tags: 'text' });

export default mongoose.models.TravelStory || mongoose.model('TravelStory', TravelStorySchema);
