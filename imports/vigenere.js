function vigenereCipher({ text, key = "KEY", mode = "encrypt" }) {
  let result = "";
  key = key.toUpperCase();
  text = text.toUpperCase();
  const isEncrypt = mode === "encrypt";

  for (let i = 0, j = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      // A-Z
      const shift = key.charCodeAt(j % key.length) - 65;
      if (isEncrypt) {
        // Encrypt mode
        const encryptedCharCode = ((charCode - 65 + shift) % 26) + 65;
        result += String.fromCharCode(encryptedCharCode);
      } else {
        // Decrypt mode
        const decryptedCharCode = ((charCode - 65 - shift + 26) % 26) + 65;
        result += String.fromCharCode(decryptedCharCode);
      }
      j++;
    } else {
      result += text[i];
    }
  }
  return result;
}

export default vigenereCipher;
