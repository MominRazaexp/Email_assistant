import EmailHistory from "../models/EmailHistory.js";

export const getHistoryController = async (req, res) => {
  try {
    const history = await EmailHistory.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error.message);
    return res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
};

export const saveHistoryController = async (req, res) => {
  const body = req.body || {};
  const emailText = body.emailText || "";
  const finalReply = body.finalReply || "";
  const steps = body.steps || [];

  if (!emailText || emailText.trim().length === 0) {
    return res.status(400).json({ message: "emailText is required" });
  }
  if (!finalReply || finalReply.trim().length === 0) {
    return res.status(400).json({ message: "finalReply is required" });
  }

  try {
    const doc = await EmailHistory.create({
      emailText,
      finalReply,
      steps
    });
    return res.json({ id: doc._id.toString() });
  } catch (error) {
    console.error("Error saving history:", error.message);
    return res.status(500).json({
      message: "Failed to save history",
      error: error.message
    });
  }
};