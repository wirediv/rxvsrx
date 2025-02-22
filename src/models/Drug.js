import mongoose from "mongoose";

const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  rxcui: { type: String, unique: true }, // RxNorm Concept ID
  classification: String,
  approvedInCanada: Boolean,
  interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interaction" }]
}, { timestamps: true });

export default mongoose.model("Drug", DrugSchema);