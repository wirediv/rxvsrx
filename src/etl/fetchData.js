import axios from "axios";
import pLimit from "p-limit";

// Rate limiter (50 requests per second for RxNorm API)
const limit = pLimit(10); // 10 parallel requests at a time to avoid overloading APIs

// Cache for Health Canada API
const healthCanadaCache = new Map();
const openFDACache = new Map();

// RxNorm API - Get Drug RxCUI with rate limiting (Concept ID)
export const fetchRxCUI = async (drugName) => {
  if (!drugName) return null;

  return limit(async () => {
    try {
      const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}`;
      const response = await axios.get(url);
      return response.data.idGroup.rxnormId?.[0] || null;
    } catch (error) {
      console.error(`RxNorm API Error for ${drugName}:`, error.message);
      return null;
    }
  });
};
// OpenFDA API - Get Drug Warnings
export const fetchOpenFDAWarnings = async (drugName) => {
    if (!drugName) return [];

    if (openFDACache.has(drugName)) {
      return openFDACache.get(drugName);
    }
  
    return limit(async () => {
      try {
        const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(drugName)}`;
        const response = await axios.get(url);
  
        const warnings = response.data.results?.[0]?.warnings || [];
        openFDACache.set(drugName, warnings);
  
        return warnings;
      } catch (error) {
        console.warn(`⚠️ OpenFDA API Error for ${drugName}:`, error.message);
        return [];
      }
    });
};

// Health Canada API - Check If Drug is Approved in Canada
// Fetch Health Canada approval status (with caching)
export const fetchHealthCanadaData = async (drugName) => {
  if (!drugName) return false;

  // Check in-memory cache first
  if (healthCanadaCache.has(drugName)) {
    return healthCanadaCache.get(drugName);
  }

  try {
    const url = `https://health-products.canada.ca/api/drug/drugproduct/?lang=en&brandname=${encodeURIComponent(drugName)}`;
    const response = await axios.get(url);
    const isApproved = response.data.length > 0;

    // Store in cache
    healthCanadaCache.set(drugName, isApproved);

    return isApproved;
  } catch (error) {
    console.warn(`⚠️ Health Canada API Error for ${drugName}:`, error.message);
    return false;
  }
};