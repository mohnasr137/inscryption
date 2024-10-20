function caesarCipher({ text, shift = 3, mode = "encrypt" }) {
  if (mode === "decrypt") {
    shift = -shift;
  }

  return text
    .split("")
    .map((char) => shiftCharacter(char, shift))
    .join("");
}

function shiftCharacter(char, shift) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz";

  if (alphabet.includes(char)) {
    let newIndex = (alphabet.indexOf(char) + shift + 26) % 26;
    return alphabet[newIndex];
  } else if (lowerAlphabet.includes(char)) {
    let newIndex = (lowerAlphabet.indexOf(char) + shift + 26) % 26;
    return lowerAlphabet[newIndex];
  } else {
    return char;
  }
}

export default caesarCipher;
