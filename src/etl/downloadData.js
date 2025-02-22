import axios from "axios";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

const BASE_URL = "https://ddinter.scbdd.com/static/media/download/";
const FILES = [
  "ddinter_downloads_code_A.csv",
  "ddinter_downloads_code_B.csv",
  "ddinter_downloads_code_D.csv",
  "ddinter_downloads_code_H.csv",
  "ddinter_downloads_code_L.csv",
  "ddinter_downloads_code_P.csv",
  "ddinter_downloads_code_R.csv",
  "ddinter_downloads_code_V.csv",
];

// Ensure "data" directory exists
const dataPath = path.join(__dirname, "../data");
if (!fs.existsSync("data")) fs.mkdirSync(dataPath);

// Function to check if a file needs downloading
const needsDownload = (filePath) => {
  if (!fs.existsSync(filePath)) return true; // If file doesn't exist, download it

  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.getTime();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago

  return lastModified < oneWeekAgo; // Only download if it's older than 7 days
};

// Function to download and parse multiple DDInter CSV files
export const downloadDDInter = async () => {
  const allResults = [];

  for (const file of FILES) {
    const url = `${BASE_URL}${file}`;
    const filePath = path.join("data", file);

    if (!needsDownload(filePath)) {
      console.log(`Skipping ${file} (Already Up-to-Date)`);
      continue;
    }

    try {
      console.log(`Downloading ${file}...`);
      const response = await axios({ url, responseType: "stream" });
      await new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(filePath))
          .on("finish", resolve)
          .on("error", reject);
      });
      console.log(`${file} Downloaded`);

      const fileResults = await parseCSV(filePath);
      allResults.push(...fileResults);
    } catch (error) {
      console.error(`Error Downloading ${file}:`, error.message);
    }
  }

  console.log("🎉 All DDInter data processed!");
  return allResults;
};

// Function to parse a CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};