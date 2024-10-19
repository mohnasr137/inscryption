// Function to generate the 5x5 Playfair cipher key matrix
function generateMatrix(keyword) {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  const matrix = [];
  const seen = new Set();

  keyword = keyword.toUpperCase().replace(/J/g, "I");

  // Add keyword letters to matrix first
  for (let char of keyword) {
    if (!seen.has(char) && alphabet.includes(char)) {
      matrix.push(char);
      seen.add(char);
    }
  }

  // Add remaining letters of the alphabet
  for (let char of alphabet) {
    if (!seen.has(char)) {
      matrix.push(char);
    }
  }

  // Convert to 5x5 matrix
  let grid = [];
  for (let i = 0; i < 25; i += 5) {
    grid.push(matrix.slice(i, i + 5));
  }

  return grid;
}

// Helper function to locate a letter in the matrix
function findPosition(matrix, letter) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === letter) {
        return { row, col };
      }
    }
  }
}

// Function to encrypt or decrypt using the Playfair cipher
function playfair(text, keyword, mode = "encrypt") {
  const matrix = generateMatrix(keyword);
  let formattedText = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  let pairs = [];

  // Form letter pairs
  for (let i = 0; i < formattedText.length; i += 2) {
    let a = formattedText[i];
    let b = formattedText[i + 1] || "X"; // Add filler X if odd length
    if (a === b) b = "X"; // No repeated letters in a pair
    pairs.push([a, b]);
  }

  let result = "";

  // Encrypt or decrypt each pair
  for (let [a, b] of pairs) {
    let posA = findPosition(matrix, a);
    let posB = findPosition(matrix, b);

    if (posA.row === posB.row) {
      // Same row
      if (mode === "encrypt") {
        result +=
          matrix[posA.row][(posA.col + 1) % 5] +
          matrix[posB.row][(posB.col + 1) % 5];
      } else {
        result +=
          matrix[posA.row][(posA.col + 4) % 5] +
          matrix[posB.row][(posB.col + 4) % 5];
      }
    } else if (posA.col === posB.col) {
      // Same column
      if (mode === "encrypt") {
        result +=
          matrix[(posA.row + 1) % 5][posA.col] +
          matrix[(posB.row + 1) % 5][posB.col];
      } else {
        result +=
          matrix[(posA.row + 4) % 5][posA.col] +
          matrix[(posB.row + 4) % 5][posB.col];
      }
    } else {
      // Rectangle swap
      result += matrix[posA.row][posB.col] + matrix[posB.row][posA.col];
    }
  }

  return result;
}

// const keyword = "PLAYFAIR";
// const plaintext = "HELLO WORLD";
// const encrypted = playfair(plaintext, keyword, "encrypt");
// const decrypted = playfair(encrypted, keyword, "decrypt");

export default playfair;
