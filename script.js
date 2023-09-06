let mines;
let flags;
const mapHeight = 10;
const mapWidth = 10;
const mineamount = 10;

function generate() {
  mines = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));
  flags = Array(mapHeight)
    .fill()
    .map(() => Array(mapWidth).fill(0));

  tableMaker(mapWidth, mapHeight);

  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        writing(x, y);
      }
    }
  }
}

function tableMaker(tableWidth, tableHeight) {
  var output = String();
  for (y = 0; y < tableHeight; y++) {
    output += "<tr>";
    for (x = 0; x < tableWidth; x++) {
      output +=
        "<td class='cell' id='" +
        y.toString() +
        x.toString() +
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
  putmine();
  document.getElementById("fu").innerHTML = "<table>" + output + "</table>";
  console.table(mines);
}

function cellUncover(y, x) {
  console.log(mines[y][x]);
  if (flags[y][x] === 1) return;
  document.getElementById(y.toString() + x.toString()).style.background =
    "white";
  field = mines[y][x];
  if (field == 0) {
    document.getElementById(y.toString() + x.toString()).innerHTML = " ";
    uncoverEmptyTouchingTiles(y, x);
  } else if (field == -1) {
    showMines();
  } else document.getElementById(y.toString() + x.toString()).innerHTML = field;
}

function flagToggle(y, x) {
  if (
    document.getElementById(y.toString() + x.toString()).style.background !=
    "white"
  ) {
    if (flags[y][x] === 0) {
      document.getElementById(y.toString() + x.toString()).innerHTML =
        "<img src='flag.jpg' alt='flag' height='20px' />";
      flags[y][x] = 1;
    } else {
      document.getElementById(y.toString() + x.toString()).innerHTML = "";
      flags[y][x] = 0;
    }

    // flags[y][x] = flags[y][x] === 0 ? 1 : 0;
    console.log(flags[y][x]);
  }
}

function putmine() {
  for (i = 0; i < mineamount; i++) {
    var y = Math.floor(Math.random() * mapHeight);
    var x = Math.floor(Math.random() * mapWidth);
    mines[y][x] = -1;
  }
}

function showMines() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        document.getElementById(y.toString() + x.toString()).style =
          "background:white";
        document.getElementById(y.toString() + x.toString()).innerHTML =
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

function writing(xPos, yPos) {
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
  // console.log(document.getElementById(parseInt(yPos-1) +''+ xPos).style)
  // top
  if (
    yPos != 0 &&
    document.getElementById(parseInt(yPos - 1) + "" + xPos).style.background !=
      "white"
  )
    cellUncover(yPos - 1, xPos);
  // right
  if (
    xPos != mapWidth - 1 &&
    document.getElementById(yPos + "" + parseInt(xPos + 1)).style.background !=
      "white"
  )
    cellUncover(yPos, xPos + 1);
  // bottom
  if (
    yPos != mapHeight - 1 &&
    document.getElementById(parseInt(yPos + 1) + "" + xPos).style.background !=
      "white"
  )
    cellUncover(yPos + 1, xPos);
  // left
  if (
    xPos != 0 &&
    document.getElementById(yPos + "" + parseInt(xPos - 1)).style.background !=
      "white"
  )
    cellUncover(yPos, xPos - 1);

  // top right
  if (
    yPos != 0 &&
    xPos != mapWidth - 1 &&
    document.getElementById(parseInt(yPos - 1) + "" + parseInt(xPos + 1)).style
      .background != "white" &&
    mines[yPos - 1][xPos + 1] > 0
  )
    cellUncover(yPos - 1, xPos + 1);

  // bottom right
  if (
    yPos != mapHeight - 1 &&
    xPos != mapWidth - 1 &&
    document.getElementById(parseInt(yPos + 1) + "" + parseInt(xPos + 1)).style
      .background != "white" &&
    mines[yPos + 1][xPos + 1] > 0
  )
    cellUncover(yPos + 1, xPos + 1);
  // bottom left
  if (
    yPos != mapHeight - 1 &&
    xPos != 0 &&
    document.getElementById(parseInt(yPos + 1) + "" + parseInt(xPos - 1)).style
      .background != "white" &&
    mines[yPos + 1][xPos - 1] > 0
  )
    cellUncover(yPos + 1, xPos - 1);
  // top left
  if (
    yPos != 0 &&
    xPos != 0 &&
    document.getElementById(parseInt(yPos - 1) + "" + parseInt(xPos - 1)).style
      .background != "white" &&
    mines[yPos - 1][xPos - 1] > 0
  )
    cellUncover(yPos - 1, xPos - 1);
}
