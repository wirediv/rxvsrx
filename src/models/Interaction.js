import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
  drug1: { type: mongoose.Schema.Types.ObjectId, ref: "Drug", required: true },
  drug2: { type: mongoose.Schema.Types.ObjectId, ref: "Drug", required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ["low", "moderate", "high"], required: true },
  confidenceScore: { type: Number, default: 0 }, // Derived from ETL data
  sources: [String] // ["RxNorm", "OpenFDA", "Health Canada"]
}, { timestamps: true });

export default mongoose.model("Interaction", InteractionSchema);