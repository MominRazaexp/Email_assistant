import express from "express";
import { processEmailController } from "../controllers/emailController.js";

const router = express.Router();

router.post("/process", processEmailController);

export default router;