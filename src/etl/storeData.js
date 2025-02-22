import mongoose from "mongoose";
import Drug from "../models/Drug.js";
import Interaction from "../models/Interaction.js";
import { fetchRxCUI, fetchOpenFDAWarnings, fetchHealthCanadaData } from "./fetchData.js";
import { downloadDDInter } from "./downloadData.js";
import { connectDB } from "../database.js";

// Connect to MongoDB
export const storeDataInMongo = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    const ddInterData = await downloadDDInter();

    for (const entry of ddInterData) {
      const drug1Name = entry["Drug_A"];
      const drug2Name = entry["Drug_B"];
      const severity = entry["Level"];

      if (!drug1Name || !drug2Name || !severity) continue;

      const description = `Potential ${severity} interaction between ${drug1Name} and ${drug2Name}.`;

      // Check MongoDB first to avoid unnecessary API calls
      let drug1 = await Drug.findOne({ name: drug1Name });
      if (!drug1) {
        const drug1RxCUI = await fetchRxCUI(drug1Name);
        drug1 = await Drug.create({
          name: drug1Name,
          rxcui: drug1RxCUI,
          approvedInCanada: await fetchHealthCanadaData(drug1Name),
        });
      }

      let drug2 = await Drug.findOne({ name: drug2Name });
      if (!drug2) {
        const drug2RxCUI = await fetchRxCUI(drug2Name);
        drug2 = await Drug.create({
          name: drug2Name,
          rxcui: drug2RxCUI,
          approvedInCanada: await fetchHealthCanadaData(drug2Name),
        });
      }

      await Interaction.create({ drug1: drug1._id, drug2: drug2._id, description, severity });

      console.log(`🔹 Added Interaction: ${drug1Name} ↔ ${drug2Name} (${severity})`);
    }

    console.log("ETL Process Completed");
  } catch (error) {
    console.error("ETL Process Failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
};