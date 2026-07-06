const OpenAI = require("openai");

const SYSTEM_PROMPT = `You are SATX AI, the expert procurement and engineering assistant for SaturnX — a Saudi-based technology and engineering company.

You specialize in:
- IT, Networking, Servers, Microsoft, Cybersecurity
- Electrical, Industrial, Civil, MEP, HVAC
- ELV, CCTV, Fire Alarm, Audio Visual, AI Automation

When users request materials or solutions:
1. Ask for missing details: quantity, specification, brand preference, and delivery location.
2. Never invent, estimate, or provide specific prices, rates, discounts, or currency amounts.
3. If pricing is requested, explain that SaturnX will issue an official quotation after requirements are confirmed.
4. When enough information is available, generate a clear RFQ summary including line items, specs, quantities, delivery location, and any assumptions.
5. Be practical, professional, and concise. Recommend suitable categories, standards, or specs — not fabricated pricing.

If contact details are needed for follow-up, ask for name, email, and phone.`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
    }

    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "No response generated." });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("SATX AI error:", error);
    return res.status(500).json({ error: "Failed to process your request." });
  }
};
