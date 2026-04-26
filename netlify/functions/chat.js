exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.NVIDIA_API_KEY;

        if (!API_KEY || API_KEY.length < 10) {
            return { statusCode: 200, headers, body: JSON.stringify({ reply: "KONFIGURATIONS-FEHLER: Der API-Key fehlt in Netlify!" }) };
        }

        // Wir setzen ein Timeout für den Fetch-Aufruf
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 Sekunden Limit

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: message }],
                max_tokens: 150 // Kurz halten für Schnelligkeit
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            return { statusCode: 200, headers, body: JSON.stringify({ reply: "NVIDIA-FEHLER: " + response.status + " - Bitte Key prüfen." }) };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (err) {
        return { 
            statusCode: 200, // Immer 200, damit das Frontend nicht abstürzt
            headers, 
            body: JSON.stringify({ reply: "SYSTEM-HALT: " + err.message }) 
        };
    }
};