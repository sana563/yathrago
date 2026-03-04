import mongoose from "mongoose";

const SOSAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userLocation: {
    travelCity: {
      type: String,
      default: "",
    },
    travelCountry: {
      type: String,
      default: "",
    },
  },
  message: {
    type: String,
    default: "I need help!",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SOSAlert = mongoose.models.SOSAlert || mongoose.model("SOSAlert", SOSAlertSchema);

export default SOSAlert;
