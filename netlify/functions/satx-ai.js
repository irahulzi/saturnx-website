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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "OPENAI_API_KEY is not configured." }),
      };
    }

    const { messages } = JSON.parse(event.body || "{}");

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Messages are required." }),
      };
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "No response generated." }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("SATX AI error:", error);

    let message = "Failed to process your request.";
    const status = error?.status;
    const code = error?.code || error?.error?.code;

    if (status === 401) {
      message =
        "OpenAI rejected the API key. In Netlify, check OPENAI_API_KEY has no extra spaces and create a new key at platform.openai.com/api-keys if needed.";
    } else if (status === 429) {
      message = "OpenAI rate limit reached. Please try again in a minute.";
    } else if (code === "insufficient_quota" || status === 402) {
      message =
        "OpenAI billing is not set up. Add a payment method at platform.openai.com/settings/billing.";
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: message }),
    };
  }
};
