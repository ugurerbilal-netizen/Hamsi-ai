export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, image, captchaToken } = req.body;

        // 1. ADIM: Güvenlik Kontrolü - Token gelmiş mi?
        if (!captchaToken) {
            return res.status(400).json({ error: "Robot doğrulama tokenı eksik!" });
        }

        // Google'dan aldığın Gizli Anahtar (Secret Key)
        const SECRET_KEY = "6LfKzQItAAAAAC7cdE3mFnreHQW_jxg1UV2GP3Rn"; 

        // 2. ADIM: Google API'sine gizlice soruyoruz: "Bu kullanıcı insan mı?"
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`;
        
        const captchaResponse = await fetch(googleVerifyUrl, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        // 3. ADIM: Google "Bu bir robot!" derse yapay zeka cevabını üretmeden engelle
        if (!captchaData.success) {
            return res.status(403).json({ error: "Robot doğrulaması başarısız. Geçiş yok!" });
        }

        // ----------------------------------------------------------------------
        // 4. ADIM: Burası senin mevcut Yapay Zeka (AI) kodunun olduğu yerdir.
        // Google doğrulaması başarılı olduğu için kodun normal akışına devam ediyor.
        
        // ÖRNEK YAPAY ZEKA CEVAP ALANI (Burayı kendi AI kodunla birleştir):
        const yapayZekaCevabi = "Robot olmadığını kanıtladın! Sana nasıl yardımcı olabilirim?"; 
        
        return res.status(200).json({ text: yapayZekaCevabi });
        // ----------------------------------------------------------------------

    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
}
