import dotenv from "dotenv";
dotenv.config();
import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;

let slackClient = null;
if (token && token.trim().length > 0) {
  slackClient = new WebClient(token);
}

export const sendSlackNotification = async (channel, text) => {
  if (!slackClient) {
    return;
  }
  try {
    await slackClient.chat.postMessage({
      channel,
      text
    });
  } catch (error) {
    console.error("Slack notification error:", error.message);
  }
};