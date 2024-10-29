function mod(n, m) {
  return ((n % m) + m) % m;
}

function matrixModInverse(matrix, modulus) {
  const [a, b, c, d] = matrix;
  const det = mod(a * d - b * c, modulus);
  const detInv = modInverse(det, modulus);

  if (detInv === null) {
    throw new Error("Matrix is not invertible modulo " + modulus);
  }

  return [
    mod(detInv * d, modulus),
    mod(-detInv * b, modulus),
    mod(-detInv * c, modulus),
    mod(detInv * a, modulus),
  ];
}

function modInverse(a, m) {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

function hillCipher({ text, key = [3, 3, 2, 5], mode = "encrypt" }) {
  if (text.length % 2 !== 0) {
    text += "X";
  }

  let textNums = text
    .toUpperCase()
    .split("")
    .map((char) => char.charCodeAt(0) - "A".charCodeAt(0));

  let keyMatrix = mode === "decrypt" ? matrixModInverse(key, 26) : key;

  let resultText = "";

  for (let i = 0; i < textNums.length; i += 2) {
    let vector = [textNums[i], textNums[i + 1]];

    let transformedVector = [
      mod(keyMatrix[0] * vector[0] + keyMatrix[1] * vector[1], 26),
      mod(keyMatrix[2] * vector[0] + keyMatrix[3] * vector[1], 26),
    ];

    resultText += String.fromCharCode(transformedVector[0] + "A".charCodeAt(0));
    resultText += String.fromCharCode(transformedVector[1] + "A".charCodeAt(0));
  }

  return resultText;
}

export default hillCipher;
