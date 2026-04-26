exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { message } = JSON.parse(event.body);
        // Wir holen den Key aus den Netlify-Umgebungsvariablen (Sicherer!)
        const API_KEY = process.env.NVIDIA_API_KEY;

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct", // Genau das Modell aus deinem Beispiel
                messages: [{"role": "user", "content": message}],
                temperature: 0.2, // Wert aus deinem Beispiel
                top_p: 0.7,       // Wert aus deinem Beispiel
                max_tokens: 1024  // Wert aus deinem Beispiel
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply: "NVIDIA meldet: " + data.error.message })
            };
        }

        // Antwort extrahieren
        const botReply = data.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: botReply })
        };

    } catch (err) {
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ reply: "Fehler: " + err.message }) 
        };
    }
};