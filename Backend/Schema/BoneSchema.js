const mongoose = require("mongoose");

const BonusCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  tokenPrice: { type: Number, required: true },
  tokenCount: { type: Number, required: true },
  active: { type: Boolean, default: true },
  deactivatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Investor" },
  usedBy: [{ type: String, ref: "Investor" }],
});

module.exports = mongoose.model("BonusCode", BonusCodeSchema);
