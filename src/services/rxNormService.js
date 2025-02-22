import axios from "axios";

export const fetchRxNormId = async (drugName) => {
  try {
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}`;
    const response = await axios.get(url);
    return response.data.idGroup.rxnormId[0] || null;
  } catch (error) {
    console.error("RxNorm API Error:", error);
    return null;
  }
};