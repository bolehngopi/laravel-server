import CryptoJS from 'crypto-js';

const RAW_KEY = process.env.MIX_APP_CRYPTO_KEY.replace('base64:', '');
const KEY = CryptoJS.enc.Base64.parse(RAW_KEY);

export const encrypt = (data) => {
    // 1. JSON stringify (Laravel does this)
    const json = JSON.stringify(data);

    // 2. Generate IV (16 bytes)
    const iv = CryptoJS.lib.WordArray.random(16);

    // 3. Encrypt
    const encrypted = CryptoJS.AES.encrypt(json, KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // 4. Laravel payload parts
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const valueBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    // 5. MAC = HMAC-SHA256(iv + value, KEY)
    const mac = CryptoJS.HmacSHA256(ivBase64 + valueBase64, KEY).toString();

    // 6. Final payload
    const payload = {
        iv: ivBase64,
        value: valueBase64,
        mac: mac,
    };

    // 7. Base64(JSON)
    return CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(JSON.stringify(payload))
    );
};

export const decrypt = (encryptStr) => {
    encryptStr = CryptoJS.enc.Base64.parse(encryptStr);
    let encryptData = encryptStr.toString(CryptoJS.enc.Utf8);
    encryptData = JSON.parse(encryptData);
    let iv = CryptoJS.enc.Base64.parse(encryptData.iv);
    var decrypted = CryptoJS.AES.decrypt(encryptData.value, KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    return JSON.parse(decrypted);
};
