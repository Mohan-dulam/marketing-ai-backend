export default async function handler(req, res) {

  // Allow requests from your website
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    // IMPORTANT: parse body manually
    let body = "";
    await new Promise((resolve) => {
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", resolve);
    });

    const { message } = JSON.parse(body);

    // Call OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: "You are a digital marketing teacher. Explain Meta Ads, Pixel, GA4, GTM, audiences and optimization in very simple beginner friendly way with examples."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openaiResponse.json();

    res.status(200).json({
      reply: data.choices?.[0]?.me
