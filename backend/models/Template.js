import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    emailType: { type: String, default: "" },
    body: { type: String, required: true },
    // Storing embedding as simple array; only used if embedding tool is triggered.
    embedding: { type: [Number], default: [] }
  },
  { timestamps: true }
);

const Template =
  mongoose.models.Template || mongoose.model("Template", TemplateSchema);

export default Template;