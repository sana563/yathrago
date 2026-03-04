import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this destination.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    details: {
        type: String,
        required: [true, 'Please provide details for this destination.'],
    },
    whatToDo: {
        type: [String],
        default: [],
    },
    packingList: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        enum: ['Hotels', 'Things to Do', 'Restaurants', 'Travel Stories'],
        default: 'Things to Do',
    },
    continent: {
        type: String,
        enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'],
        required: true,
    },
    expense: {
        type: String,
        enum: ['Budget', 'Mid-range', 'Luxury'],
        default: 'Mid-range',
    },
    tags: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true,
});

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
