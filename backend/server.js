import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import emailRoutes from "./routes/emailRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/email", emailRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/monitoring", monitoringRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});