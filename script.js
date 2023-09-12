let mines; // 0 - Empty | -1 - Mine | 1+ - number
let flags; // 0 - No flag | 1 - Flag
let coveredTiles; // 0 - Uncovered | 1 - Covered
let mapHeight = 10;
let mapWidth = 10;
let mineamount = 10;
let gameState = 'start';
let time
let myTimer

// disable contextmenu
// https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
document.addEventListener("contextmenu", (event) => event.preventDefault());

function check() {
  console.table(coveredTiles);
}

function generate() {
  gameState = 'start';
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
          onclick="cellUncover(${y}, ${x})"
          oncontextmenu="flagToggle(${y}, ${x})">
        </td>`;
    }
    output += "</tr>";
  }

  document.getElementById("fu").innerHTML =
    "<table id='Area'>" + output + "</table>";
}

function cellUncover(y, x) {
  if (gameState == 'end') return;
  if (gameState == 'start') {
    //timer and display
  myTimer = setInterval(function(){
    time++;
    document.getElementById("timer").innerHTML = convertTime(time);
  }
  ,10);
    gameState = 'ongoing';  
  }
  //sprawdza czy flaga jest postawiona
  if (flags[y][x] === 1) return;
  document.getElementById(`${y}-${x}`).style.background = "white";
  coveredTiles[y][x] = 0;
  field = mines[y][x];
  if (field === 0) {
    document.getElementById(`${y}-${x}`).innerHTML = " ";
    uncoverEmptyTouchingTiles(y, x);
  } else if (field === -1) {
    showMines();
    console.log("LOSER LOSER BONER CRUSER");
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
  if (localStorage.getItem("leaderboard") === null) {
    localStorage.setItem("leaderboard", JSON.stringify([]));
  }
}

function addEntryToLeaderboard(playerName, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
  leaderboard.push({ playerName, score });
  leaderboard.sort((a, b) => a.score - b.score);
  // leaderboard.reverse();
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  const topTenEntries = leaderboard.slice(0, 10);
  // leaderboard.forEach((entry) => {
  topTenEntries.forEach((entry) => {
    const listItem = document.createElement("li");
    console.log(entry.score);
    listItem.textContent = `${entry.playerName}: ${convertTime(entry.score)}`;
    leaderboardList.appendChild(listItem);
  });
}

function flagToggle(y, x) {
  if (gameState == 'end') return;
  if (document.getElementById(`${y}-${x}`).style.background != "white") {
    if (flags[y][x] === 0) {
      document.getElementById(`${y}-${x}`).innerHTML =
        "<img src='flag.png' alt='flag' height='20px' width='20px' />";
      flags[y][x] = 1;
    } else {
      document.getElementById(`${y}-${x}`).innerHTML = "";
      flags[y][x] = 0;
    }

    checkWin();
    // flags[y][x] = flags[y][x] === 0 ? 1 : 0;
    // console.log(flags[y][x]);
  }
  updateCounter();
}

function checkWin() {
  if (gameState == 'end') return;
  if (countOnesInArray(coveredTiles, 0) === mapHeight * mapWidth - mineamount) {
    let counter = 0; //jaki jest sens zaznaczania flag po odkryciu wszystkich pól? tylko gre wydłurza
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if (mines[y][x] === -1 && flags[y][x] === 1) {
          counter++;
        }
      }
    }
    if (counter === mineamount) {
      gameState = 'end';
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



function convertTime(score){

  let m = Math.floor(score/6000);
  let s = Math.floor(score/100 - m*60);
  let ms =  score % 100;
  if(m < 10) m = "0" + m;
  if(s < 10) s = "0" + s;
  if(ms < 10) ms = "0" + ms;
  return(m +":" + s + ":" + ms);
  
}

function setMines() {
  for (i = 0; i < mineamount; i++) {
    do {
      var y = Math.floor(Math.random() * mapHeight);
      var x = Math.floor(Math.random() * mapWidth);
      console.log(x, y);
    } while (mines[y][x] == -1);
    mines[y][x] = -1;
  }
}

function showMines() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        document.getElementById(`${y}-${x}`).style = "background:white";
        document.getElementById(`${y}-${x}`).innerHTML =
          "<img src='mine.png' width='20px'>";
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

    if (isValidCell(newY,newX)){  //(newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) { //optymalization
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
    if (isValidCell(newY, newX) && !isCellUncovered(newY, newX)) {
      cellUncover(newY, newX);
    }
  }
}

function isValidCell(y, x) {
  return y >= 0 && y < mapHeight && x >= 0 && x < mapWidth;
}

function isCellUncovered(y, x) {
  return document.getElementById(`${y}-${x}`).style.background === "white";
}

function countOnesInArray(arr, num) {
  let n = 0;
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (arr[y][x] == num) n++;
    }
    //console.log(arr[i], " ", num);
  }
  return n;
}

function countOnesIn2DArray(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 1) {
        count++;
      }
    }
  }
  return count;
}

function updateCounter() {
  document.getElementById("flag-count").innerHTML =
    mineamount - countOnesIn2DArray(flags);
}

function chooseDifficulty(difficulty){

  const difficultySettings =  {
    easy: {
      width:7,
      height:7,
      bombs:10   
    },
    medium: {
      width:10, 
      height:10,
      bombs:15

    },
    hard: {
      width: 20,
      height:20,
      bombs:45

    },
    insane: {
      width: 40,
      height:40,
      bombs: 90

    }
  }

  mapHeight = difficultySettings[difficulty].height;
  mapWidth = difficultySettings[difficulty].width;
  mineamount = difficultySettings[difficulty].bombs;
  generate();
}