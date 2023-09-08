let mines; // 0 - Empty | -1 - Mine | 1+ - number
let flags; // 0 - No flag | 1 - Flag
let coveredTiles; // 0 - Uncovered | 1 - Covered
const mapHeight = 5;
const mapWidth = 5;
const mineamount = 5;

// disable contextmenu
// https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
document.addEventListener("contextmenu", (event) => event.preventDefault());

function check() {
  console.table(coveredTiles);
}

function generate() {
  mines = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));
  flags = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));
  coveredTiles = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(1));

  tableMaker();
  updateCounter();

  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        writingCellValue(x, y);
      }
    }
  }
  // console.table(mines);
}

function tableMaker() {
  var output = String();
  for (y = 0; y < mapHeight; y++) {
    output += "<tr>";
    for (x = 0; x < mapWidth; x++) {
      output +=
        "<td class='cell' id='" +
        y +
        "-" +
        x +
        "' style='background:lightgrey' onclick='cellUncover(" +
        y +
        "," +
        x +
        ")' oncontextmenu='flagToggle(" +
        y +
        "," +
        x +
        ")'></td>";
    }
    output += "</tr>";
  }
  setMines();
  document.getElementById("fu").innerHTML =
    "<table id='Area'>" + output + "</table>";
}

function cellUncover(y, x) {
  //sprawdza czy flaga jest postawiona
  if (flags[y][x] === 1) return;
  document.getElementById(y + "-" + x).style.background = "white";
  coveredTiles[y][x] = 0;
  field = mines[y][x];
  if (field === 0) {
    document.getElementById(y + "-" + x).innerHTML = " ";
    uncoverEmptyTouchingTiles(y, x);
  } else if (field === -1) {
    showMines();
    console.log("LOSER LOSER BONER CRUSER");
  } else {
    document.getElementById(y + "-" + x).innerHTML = field;
  }
  console.log(
    countInArray(coveredTiles, 0),
    " ",
    mapHeight * mapWidth - mineamount
  );
  if (countInArray(coveredTiles, 0) == mapHeight * mapWidth - mineamount)
    console.log("WINNER WINNER CHIKEN DINNER");
}

function flagToggle(y, x) {
  if (document.getElementById(y + "-" + x).style.background != "white") {
    if (flags[y][x] === 0) {
      document.getElementById(y + "-" + x).innerHTML =
        "<img src='flag.png' alt='flag' height='20px' width='20px' />";
      flags[y][x] = 1;
    } else {
      document.getElementById(y + "-" + x).innerHTML = "";
      flags[y][x] = 0;
    }

    // flags[y][x] = flags[y][x] === 0 ? 1 : 0;
    // console.log(flags[y][x]);
  }
  updateCounter();
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
        document.getElementById(y + "-" + x).style = "background:white";
        document.getElementById(y + "-" + x).innerHTML =
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
  if (yPos != mapHeight - 1 && xPos != 0)
    if (mines[yPos + 1][xPos - 1] > -1) mines[yPos + 1][xPos - 1] += 1;

  if (yPos != mapHeight - 1)
    if (mines[yPos + 1][xPos] > -1) mines[yPos + 1][xPos] += 1;

  if (yPos != mapHeight - 1 && xPos != mapHeight - 1)
    if (mines[yPos + 1][xPos + 1] > -1) mines[yPos + 1][xPos + 1] += 1;

  if (xPos != 0) if (mines[yPos][xPos - 1] > -1) mines[yPos][xPos - 1] += 1;

  if (xPos != mapHeight - 1)
    if (mines[yPos][xPos + 1] > -1) mines[yPos][xPos + 1] += 1;

  if (yPos != 0 && xPos != 0)
    if (mines[yPos - 1][xPos - 1] > -1) mines[yPos - 1][xPos - 1] += 1;

  if (yPos != 0) if (mines[yPos - 1][xPos] > -1) mines[yPos - 1][xPos] += 1;

  if (yPos != 0 && xPos != mapHeight - 1)
    if (mines[yPos - 1][xPos + 1] > -1) mines[yPos - 1][xPos + 1] += 1;
}

function uncoverEmptyTouchingTiles(yPos, xPos) {
  // top
  if (
    yPos != 0 &&
    document.getElementById(parseInt(yPos - 1) + "-" + xPos).style.background !=
      "white"
  )
    cellUncover(yPos - 1, xPos);
  // right
  if (
    xPos != mapWidth - 1 &&
    document.getElementById(yPos + "-" + parseInt(xPos + 1)).style.background !=
      "white"
  )
    cellUncover(yPos, xPos + 1);
  // bottom
  if (
    yPos != mapHeight - 1 &&
    document.getElementById(parseInt(yPos + 1) + "-" + xPos).style.background !=
      "white"
  )
    cellUncover(yPos + 1, xPos);
  // left
  if (
    xPos != 0 &&
    document.getElementById(yPos + "-" + parseInt(xPos - 1)).style.background !=
      "white"
  )
    cellUncover(yPos, xPos - 1);

  // top right
  if (
    yPos != 0 &&
    xPos != mapWidth - 1 &&
    document.getElementById(parseInt(yPos - 1) + "-" + parseInt(xPos + 1)).style
      .background != "white"
  )
    cellUncover(yPos - 1, xPos + 1);

  // bottom right
  if (
    yPos != mapHeight - 1 &&
    xPos != mapWidth - 1 &&
    document.getElementById(parseInt(yPos + 1) + "-" + parseInt(xPos + 1)).style
      .background != "white"
  )
    cellUncover(yPos + 1, xPos + 1);
  // bottom left
  if (
    yPos != mapHeight - 1 &&
    xPos != 0 &&
    document.getElementById(parseInt(yPos + 1) + "-" + parseInt(xPos - 1)).style
      .background != "white"
  )
    cellUncover(yPos + 1, xPos - 1);
  // top left
  if (
    yPos != 0 &&
    xPos != 0 &&
    document.getElementById(parseInt(yPos - 1) + "-" + parseInt(xPos - 1)).style
      .background != "white"
  )
    cellUncover(yPos - 1, xPos - 1);
}

function countInArray(arr, num) {
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
