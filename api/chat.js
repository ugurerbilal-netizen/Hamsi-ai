export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
    }

    const { message, image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Anahtarı sunucuda eksik!' });
    }

    try {
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        // Gemini API'sinin hem metin hem resmi anlayacağı veri yapısını kuruyoruz
        let parts = [];
        
        if (message) {
            parts.push({ text: message });
        }
        
        if (image) {
            // Base64 formatındaki resim verisini ayıklıyoruz
            const mimeType = image.split(';')[0].split(':')[1];
            const base64Data = image.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        // Eğer hiçbir şey gönderilmediyse hata ver
        if (parts.length === 0) {
            return res.status(400).json({ error: 'İçerik boş olamaz.' });
        }

        const apiResponse = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: parts }]
            })
        });

        const data = await apiResponse.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({ error: 'Yapay zekadan geçerli bir yanıt alınamadı.' });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: aiReply });

    } catch (error) {
        return res.status(500).json({ error: 'Gemini API sunucu hatası.' });
    }
}
