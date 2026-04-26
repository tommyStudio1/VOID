exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.NVIDIA_API_KEY;

        // Wir nutzen die absolute Basis-URL von NVIDIA
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct", // Prüfe ob dein Key für dieses Modell ist!
                messages: [{ role: "user", content: message }],
                temperature: 0.5,
                top_p: 1,
                max_tokens: 1024
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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (err) {
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ reply: "TIMEOUT/FEHLER: Die KI braucht zu lange oder der Key ist inaktiv. (" + err.message + ")" }) 
        };
    }
};