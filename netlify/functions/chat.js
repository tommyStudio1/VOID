exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { message } = JSON.parse(event.body);
        // Nutze die Umgebungsvariable von Netlify für die Sicherheit!
        const API_KEY = process.env.NVIDIA_API_KEY;

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Hier das Modell aus deinem Beispiel
                model: "nvidia/nemotron-3-super-120b-a12b",
                messages: [{ role: "user", content: message }],
                temperature: 1,
                top_p: 0.95,
                max_tokens: 4096 // Ein sicherer Wert für Netlify
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply: "NVIDIA-Fehler: " + data.error.message })
            };
        }

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
            body: JSON.stringify({ reply: "Verbindung zu VOID unterbrochen: " + err.message }) 
        };
    }
};