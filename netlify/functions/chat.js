exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.NVIDIA_API_KEY;

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/llama-3.1-nemotron-nano-8b-v1", // Exakter Name korrigiert
                messages: [{ role: "user", content: message }],
                temperature: 0.5,
                top_p: 1,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        // Falls NVIDIA einen Fehler zurückgibt (z.B. falscher Key für dieses Modell)
        if (data.error) {
            console.error("NVIDIA API Error:", data.error);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply: "NVIDIA meldet: " + data.error.message })
            };
        }

        // Die Antwort der KI extrahieren
        const botReply = data.choices?.[0]?.message?.content || "API hat keine Antwort geliefert.";

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: botReply })
        };

    } catch (err) {
        console.error("Function Error:", err);
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ reply: "SYSTEM-HALT: " + err.message }) 
        };
    }
};