export default async function handler(req, res) {

  // Allow your website to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST request" });
  }

  try {

    // Vercel automatically parses JSON body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message sent" });
    }

    // Call OpenAI
    const openai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly teacher who explains Meta Ads, Facebook Ads, Pixel, CAPI, GA4, GTM, audiences, KPIs and optimization step-by-step with simple real-life examples."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openai.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: "Backend crashed. Check API key or OpenAI usage."
    });
  }
}
