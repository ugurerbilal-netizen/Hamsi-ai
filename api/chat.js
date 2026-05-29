export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
    }

    const userMessage = req.body.message;
    const apiKey = process.env.GEMINI_API_KEY; // Anahtar burada gizli kalacak

    if (!apiKey) {
        return res.status(500).json({ error: 'API Anahtarı sunucuda tanımlanmamış!' });
    }

    try {
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const apiResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await apiResponse.json();
        const aiReply = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ text: aiReply });

    } catch (error) {
        return res.status(500).json({ error: 'Gemini API bağlantı hatası.' });
    }
}
