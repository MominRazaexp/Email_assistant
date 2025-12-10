import express from "express";
import {
  getHistoryController,
  saveHistoryController
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getHistoryController);
router.post("/save", saveHistoryController);

export default router;