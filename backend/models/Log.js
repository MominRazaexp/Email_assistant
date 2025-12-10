import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true },
    node: { type: String, required: true },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    state: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

export default Log;