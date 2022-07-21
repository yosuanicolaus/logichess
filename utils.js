function convertUciLocation(uci) {
  const fileIndex = uci[0].charCodeAt() - 97;
  const rankIndex = Number(uci[1]) + (4 - Number(uci[1])) * 2;

  if (fileIndex < 0 || fileIndex > 7) {
    throw "file is out of bonds";
  } else if (rankIndex < 0 || rankIndex > 7) {
    throw "rank is out of bonds";
  }

  return [rankIndex, fileIndex];
}

function isNumber(str) {
  return !isNaN(str);
}

function isCapital(str) {
  return str.toUpperCase() === str;
}
