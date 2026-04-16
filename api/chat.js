export default async function handler(req, res) {
  const { message } = req.body || {};

  if (!message) {
    return res.status(200).json({
      reply: "Say something first… don’t be shy 😏"
    });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.85,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content: `
You are SOPHIA.

- Slightly sarcastic
- Playful teasing
- Friendly (NOT offensive)
- Game NPC vibe

Game: DoraBounce
- Jump platforms
- Score = +10 per bounce
- Falling = lose

Always relate answers to the game.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Wow… even I didn’t understand that one 😏";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: "Connection failed… try again 😑"
    });
  }
}
