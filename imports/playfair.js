function generateMatrix(keyword) {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  const matrix = [];
  const seen = new Set();

  keyword = keyword.toUpperCase().replace(/J/g, "I");

  for (let char of keyword) {
    if (!seen.has(char) && alphabet.includes(char)) {
      matrix.push(char);
      seen.add(char);
    }
  }

  for (let char of alphabet) {
    if (!seen.has(char)) {
      matrix.push(char);
    }
  }

  let grid = [];
  for (let i = 0; i < 25; i += 5) {
    grid.push(matrix.slice(i, i + 5));
  }

  return grid;
}

function findPosition(matrix, letter) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === letter) {
        return { row, col };
      }
    }
  }
}

function playfair({ text, keyword = "cipher", mode = "encrypt" }) {
  const matrix = generateMatrix(keyword);
  let formattedText = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  let pairs = [];

  for (let i = 0; i < formattedText.length; i += 2) {
    let a = formattedText[i];
    let b = formattedText[i + 1] || "X";
    if (a === b) b = "X";
    pairs.push([a, b]);
  }

  let result = "";

  for (let [a, b] of pairs) {
    let posA = findPosition(matrix, a);
    let posB = findPosition(matrix, b);

    if (posA.row === posB.row) {
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
      result += matrix[posA.row][posB.col] + matrix[posB.row][posA.col];
    }
  }

  return result;
}

export default playfair;
