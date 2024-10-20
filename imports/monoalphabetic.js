function monoalphabeticCipher({
  text,
  key = "QWERTYUIOPLKJHGFDSAZXCVBNM",
  mode = "encrypt",
}) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  text = text.toUpperCase();

  if (mode === "encrypt") {
    return text
      .split("")
      .map((char) => {
        if (alphabet.includes(char)) {
          return key[alphabet.indexOf(char)];
        }
        return char;
      })
      .join("");
  } else if (mode === "decrypt") {
    return text
      .split("")
      .map((char) => {
        if (key.includes(char)) {
          return alphabet[key.indexOf(char)];
        }
        return char;
      })
      .join("");
  }
}

export default monoalphabeticCipher;
