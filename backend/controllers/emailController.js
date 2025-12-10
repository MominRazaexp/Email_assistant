import { processEmail } from "../services/emailService.js";

export const processEmailController = async (req, res) => {
  const body = req.body || {};
  const emailText = body.emailText || "";

  if (!emailText || emailText.trim().length === 0) {
    return res.status(400).json({
      message: "emailText is required"
    });
  }

  try {
    const result = await processEmail(emailText);
    return res.json(result);
  } catch (error) {
    console.error("Error processing email:", error);
    return res.status(500).json({
      message: "Failed to process email",
      error: error.message
    });
  }
};