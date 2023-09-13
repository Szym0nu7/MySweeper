let mines; // 0 - Empty | -1 - Mine | 1+ - number
let flags; // 0 - No flag | 1 - Flag
let coveredTiles; // 0 - Uncovered | 1 - Covered
let mapHeight = 10;
let mapWidth = 10;
let mineamount = 10;
let gameState = "start";
let difficultyID = 0;
let time;
let myTimer;

const difficultySettings = {
  easy: {
    id: 0,
    width: 7,
    height: 7,
    bombs: 7,
  },
  medium: {
    id: 1,
    width: 10,
    height: 10,
    bombs: 15,
  },
  hard: {
    id: 2,
    width: 15,
    height: 15,
    bombs: 45,
  },
  insane: {
    id: 3,
    width: 17,
    height: 17,
    bombs: 25,
  },
};

// disable contextmenu
// https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
document.addEventListener("contextmenu", (event) => event.preventDefault());

function check() {
  console.table(coveredTiles);
}

function generate() {
  gameState = "start";
  clearInterval(myTimer);

  mines = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));
  flags = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));
  coveredTiles = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(1));

  time = 0;
  document.getElementById("timer").innerHTML = convertTime(time);
  tableMaker();
  updateCounter();
  setMines();

  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      writingCellValue(x, y);
    }
  }
}

function tableMaker() {
  var output = String();
  for (y = 0; y < mapHeight; y++) {
    output += "<tr>";
    for (x = 0; x < mapWidth; x++) {
      output += `<td class="cell" id="${y}-${x}" style="background:lightgrey"
          onclick="cellUncover(${y}, ${x},${true})"
          oncontextmenu="flagToggle(${y}, ${x})">
        </td>`;
    }
    output += "</tr>";
  }

  document.getElementById("fu").innerHTML =
    "<table id='Area'>" + output + "</table>";
}

function cellUncover(y, x, clicked = false) {
  if (gameState == "end") return;
  if (gameState == "start") {
    //timer and display
    myTimer = setInterval(function () {
      time++;
      document.getElementById("timer").innerHTML = convertTime(time);
    }, 10);
    gameState = "ongoing";
  }
  //sprawdza czy flaga jest postawiona
  if (flags[y][x] === 1) return;

  if (isCellUncovered(y, x) && clicked) uncoverTouchingTiles(y, x);

  document.getElementById(`${y}-${x}`).style.background = "white";
  coveredTiles[y][x] = 0;
  field = mines[y][x];
  if (field === 0) {
    document.getElementById(`${y}-${x}`).innerHTML = " ";
    uncoverEmptyTouchingTiles(y, x);
  } else if (field === -1) {
    showMines();
    gameEnd();
  } else {
    document.getElementById(`${y}-${x}`).innerHTML = field;
  }
  checkWin();
}

window.onload = function () {
  initializeLeaderboard();
  displayLeaderboard();
};

function playerFinishedGame(playerName, score) {
  addEntryToLeaderboard(playerName, score);
  displayLeaderboard();
}

function initializeLeaderboard() {
  for (let i = 0; i <= 3; i++) {
    if (localStorage.getItem(`leaderboard-${i}`) === null) {
      localStorage.setItem(`leaderboard-${i}`, JSON.stringify([]));
    }
  }
}

function addEntryToLeaderboard(playerName, score) {
  const leaderboard = JSON.parse(
    localStorage.getItem(`leaderboard-${difficultyID}`)
  );
  leaderboard.push({ playerName, score });
  leaderboard.sort((a, b) => a.score - b.score);
  // leaderboard.reverse();
  localStorage.setItem(
    `leaderboard-${difficultyID}`,
    JSON.stringify(leaderboard)
  );
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(
    localStorage.getItem(`leaderboard-${difficultyID}`)
  );
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  const topTenEntries = leaderboard.slice(0, 10);
  // leaderboard.forEach((entry) => {
  topTenEntries.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.playerName}: ${convertTime(entry.score)}`;
    leaderboardList.appendChild(listItem);
  });
}

function flagToggle(y, x) {
  if (gameState == "end") return;
  if (document.getElementById(`${y}-${x}`).style.background != "white") {
    if (flags[y][x] === 0) {
      document.getElementById(`${y}-${x}`).innerHTML =
        "<img src='flag.png' alt='flag' />";
      flags[y][x] = 1;
    } else {
      document.getElementById(`${y}-${x}`).innerHTML = "";
      flags[y][x] = 0;
    }

    checkWin();
  }
  updateCounter();
}

function checkWin() {
  if (gameState == "end") return;
  if (
    countOnesIn2DArray(coveredTiles, 0) ===
    mapHeight * mapWidth - mineamount
  ) {
    let counter = 0; //jaki jest sens zaznaczania flag po odkryciu wszystkich pól? tylko gre wydłurza
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if (mines[y][x] === -1 && flags[y][x] === 1) {
          counter++;
        }
      }
    }
    if (counter === mineamount) {
      gameState = "end";
      clearInterval(myTimer);
      let playerName;
      do {
        playerName = prompt(`Enter 3 letter name:`);
        playerName = playerName ? playerName.trim().toUpperCase() : "";
      } while (!playerName.match(/^[A-Z]{3}$/));
      playerFinishedGame(playerName, time); //TODO change from random to timer variable
    }
  }
}

function convertTime(score) {
  let m = Math.floor(score / 6000);
  let s = Math.floor(score / 100 - m * 60);
  let ms = score % 100;
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;
  if (ms < 10) ms = "0" + ms;
  return m + ":" + s + ":" + ms;
}

function setMines() {
  for (i = 0; i < mineamount; i++) {
    do {
      var y = Math.floor(Math.random() * mapHeight);
      var x = Math.floor(Math.random() * mapWidth);
    } while (mines[y][x] == -1);
    mines[y][x] = -1;
  }
}

function showMines() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        document.getElementById(`${y}-${x}`).style = "background:white";
        document.getElementById(`${y}-${x}`).innerHTML = "<img src='mine.png'>";
      }
    }
  }
}
// function run() {
//   for (var y = 0; y < border; y++) {
//     for (var x = 0; x < xborder; x++) {
//       if (mines[y][x] == -1) {
//         writing(x, y);
//       }
//     }
//   }
//   typing();
// }

function writingCellValue(xPos, yPos) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  if (mines[yPos][xPos] === -1) return; // omiń jeżeli nasz koordynat to bomba

  let count = 0;

  for (const [dx, dy] of directions) {
    const newX = xPos + dx;
    const newY = yPos + dy;

    if (isInbound(newY, newX)) {
      //(newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) { //optymalization
      if (mines[newY][newX] === -1) {
        count++;
      }
    }
  }

  mines[yPos][xPos] = count;
}
function uncoverEmptyTouchingTiles(yPos, xPos) {
  // lewo góra,   góra, prawo góra
  // lewo środek, --- , prawo środek
  // lewo dół,    dół , prawo dół
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    //kalkulowanie nowych koordynatow
    const newY = yPos + dy;
    const newX = xPos + dx;

    // sprawdzanie czy nie jest na bandzie, sprawdzanie czy pole jest juz odkryte
    if (isInbound(newY, newX) && !isCellUncovered(newY, newX)) {
      cellUncover(newY, newX);
    }
  }
}

function uncoverTouchingTiles(yPos, xPos) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let countFlags = 0;
  for (const [dx, dy] of directions) {
    const newY = yPos + dy;
    const newX = xPos + dx;
    if (isInbound(newY, newX) && flags[newY][newX] == 1) countFlags++;
  }
  if (countFlags != mines[yPos][xPos]) return;

  for (const [dx, dy] of directions) {
    const newY = yPos + dy;
    const newX = xPos + dx;

    if (isInbound(newY, newX) && !isCellUncovered(newY, newX)) {
      cellUncover(newY, newX);
    }
  }
}

function isInbound(y, x) {
  return y >= 0 && y < mapHeight && x >= 0 && x < mapWidth;
}

function isCellUncovered(y, x) {
  return document.getElementById(`${y}-${x}`).style.background === "white";
}
function countOnesIn2DArray(arr, num) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === num) {
        count++;
      }
    }
  }
  return count;
}

function updateCounter() {
  document.getElementById("flag-count").innerHTML =
    mineamount - countOnesIn2DArray(flags, 1);
}

function chooseDifficulty(difficulty = "easy") {
  switch (difficulty) {
    case "easy":
      difficultyID = 0;
      break;
    case "medium":
      difficultyID = 1;
      break;
    case "hard":
      difficultyID = 2;
      break;
    case "insane":
      difficultyID = 3;
      break;
  }
  mapHeight = difficultySettings[difficulty].height;
  mapWidth = difficultySettings[difficulty].width;
  mineamount = difficultySettings[difficulty].bombs;
  generate();
  displayLeaderboard();
}

function gameEnd() {
  gameState = "end";
  clearInterval(myTimer);
  alert("LOSER LOSER BONER CRUSER");
}
