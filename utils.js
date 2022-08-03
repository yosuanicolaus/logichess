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

function convertRankFile(rank, file) {
  const r = (rank + (4 - rank) * 2).toString();
  const f = String.fromCharCode(97 + file);
  return f + r;
}

function isNumber(str) {
  return !isNaN(str);
}

function isCapital(str) {
  return str.toUpperCase() === str;
}

function addIncrement(target, increment) {
  target[0] += increment[0];
  target[1] += increment[1];
}

function allDifferent(...args) {
  const seen = new Set();
  for (const arg of args) {
    if (seen.has(arg)) {
      return false;
    }
    seen.add(arg);
  }
  return true;
}

function factionCode(faction, code) {
  if (faction === "w") {
    return code.toUpperCase();
  } else if (faction === "b") {
    return code.toLowerCase();
  } else {
    throw "faction should be either 'w'/'b'!";
  }
}

// faction = "w" / "b"
// panelPiece = "\pnbrqkPNBRQK\"
function sameFaction(faction, panelPiece) {
  return (
    (faction === "w" && isCapital(panelPiece)) ||
    (faction === "b" && !isCapital(panelPiece))
  );
}
