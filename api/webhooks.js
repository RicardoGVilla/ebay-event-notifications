import crypto from "crypto";

// Hardcoded for testing only
const VERIFICATION_TOKEN = "my_verification_token_1234567890_abcdef_";
const ENDPOINT_URL = "https://ebay-event-notifications.vercel.app/api/webhook";

export default async function handler(req, res) {
  // Handle eBay challenge request (GET)
  if (req.method === "GET") {
    const challengeCode = req.query.challenge_code;
    if (!challengeCode) {
      return res.status(400).json({ error: "Missing challenge_code" });
    }

    const hash = crypto.createHash("sha256");
    hash.update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL);
    const challengeResponse = hash.digest("hex");

    return res.status(200).json({ challengeResponse });
  }

  // Handle eBay notifications (POST)
  if (req.method === "POST") {
    // Immediately acknowledge the notification
    res.status(200).end();

    // Log payload for testing
    const payload = req.body;
    console.log(
      "Received eBay notification:",
      JSON.stringify(payload, null, 2)
    );

    // TODO: Add logic to delete user data or process events here
    return;
  }

  // Unsupported method
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
