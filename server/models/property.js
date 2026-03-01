const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  propType: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  additionalInfo: { type: String, required: true },
  contact: { type: String, required: true },
  image: { type: String }, // NEW
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);