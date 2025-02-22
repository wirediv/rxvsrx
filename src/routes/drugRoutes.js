import express from "express";
import { getAllDrugs, getDrugByName } from "../controllers/drugController.js";

const router = express.Router();

router.get("/", getAllDrugs);
router.get("/:name", getDrugByName);

export default router;