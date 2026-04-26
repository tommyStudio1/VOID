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
                model: "meta/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: message }],
                temperature: 0.2,
                top_p: 0.7,
                max_tokens: 512, // Kleinerer Wert = schnellere Antwort
                stream: false    // WICHTIG: Explizit auf false setzen!
            })
        });

        // Falls der Server gar nicht antwortet
        if (!response.ok) {
            const errorMsg = await response.text();
            return { statusCode: 200, headers, body: JSON.stringify({ reply: "NVIDIA ist gerade überlastet. Code: " + response.status }) };
        }

        const data = await response.json();
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
            body: JSON.stringify({ reply: "VOID-Verbindung instabil. Bitte noch einmal versuchen." }) 
        };
    }
};