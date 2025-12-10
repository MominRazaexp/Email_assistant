import mongoose from "mongoose";

const StepSchema = new mongoose.Schema(
  {
    node: { type: String, required: true },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const EmailHistorySchema = new mongoose.Schema(
  {
    emailText: { type: String, required: true },
    finalReply: { type: String, required: true },
    steps: { type: [StepSchema], default: [] }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const EmailHistory =
  mongoose.models.EmailHistory ||
  mongoose.model("EmailHistory", EmailHistorySchema);

export default EmailHistory;