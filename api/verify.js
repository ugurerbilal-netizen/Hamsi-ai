export default async function handler(req, res) {
    // Sadece POST isteklerini kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { captchaToken } = req.body;

        if (!captchaToken) {
            return res.status(400).json({ error: "Doğrulama tokenı eksik!" });
        }

        const SECRET_KEY = "6LfKzQItAAAAAC7cdE3mFnreHQW_jxg1UV2GP3Rn"; 

        // Google API sunucularına doğrulama isteği atılıyor
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`;
        const captchaResponse = await fetch(googleVerifyUrl, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        // Eğer Google geçersiz derse engelle
        if (!captchaData.success) {
            return res.status(403).json({ error: "Google doğrulamayı reddetti. Robot olabilirsiniz!" });
        }

        // Başarılıysa olumlu dönüş yap
        return res.status(200).json({ success: true });

    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
}
