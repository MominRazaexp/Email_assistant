import express from "express";
import { getGraphController } from "../controllers/monitoringController.js";

const router = express.Router();

router.get("/graph", getGraphController);

export default router;