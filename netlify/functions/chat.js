exports.handler = async (event) => {
  // CORS-Header für die Antwort (erlaubt die Kommunikation)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTION"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const { system, message } = JSON.parse(event.body);
    const API_KEY = process.env.NVIDIA_API_KEY;

    if (!API_KEY) {
      throw new Error("NVIDIA_API_KEY fehlt in den Netlify-Einstellungen!");
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct", 
        messages: [
          { "role": "system", "content": system },
          { "role": "user", "content": message }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    const data = await response.json();

    // Falls NVIDIA einen Fehler zurückgibt (z.B. Key ungültig)
    if (data.status === "error" || data.error) {
       console.error("NVIDIA API Fehler:", data);
       return { 
         statusCode: 401, 
         headers, 
         body: JSON.stringify({ reply: "Systemfehler: API Key oder Modell-Zugriff verweigert." }) 
       };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Function Error:", error.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message, reply: "SYSTEM ERROR: " + error.message }) 
    };
  }
};