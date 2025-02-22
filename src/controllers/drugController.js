import Drug from "../models/Drug.js";

export const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find();
    console.log('drugs', drugs)
    res.json(drugs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getDrugByName = async (req, res) => {
  try {
    console.log('params', req.params)
    const drug = await Drug.findOne({ name: req.params.name });
    if (!drug) return res.status(404).json({ error: "Drug not found" });
    res.json(drug);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};