let mines
const mapHeight = 10;
const mapWidth = 10;
const mineamount = 40;

function generate() {
  mines = Array(mapHeight).fill().map(() => Array(mapWidth).fill(0));

  tableMaker(mapWidth, mapHeight)

  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      if (mines[y][x] == -1) {
        writing(x, y);
      }
    }
  }
  
  typing();
}

function tableMaker(tableWidth, tableHeight) {
  var output = String();
  for (y = 0; y < tableHeight; y++) {
    output += "<tr>";
    for (x = 0; x < tableWidth; x++) {
      //output += "<td>1</td>";
      output +=
        "<td class='cell' id='" + y.toString() + x.toString() + "'></td>";
    }
    output += "</tr>";
  }
  putmine();
  document.getElementById("fu").innerHTML =
    "<table>" + output + "</table>";
  console.table(mines);
}

function putmine() {
  for (i = 0; i < mineamount; i++) {
    var y = Math.floor(Math.random() * mapHeight);
    var x = Math.floor(Math.random() * mapWidth);
    mines[y][x] = -1;
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
  console.log(yPos + " " + xPos);

  if (yPos != mapHeight - 1 && xPos != 0)
    if (mines[yPos + 1][xPos - 1] > -1) mines[yPos + 1][xPos - 1] += 1;

  if (yPos != mapHeight - 1) 
    if (mines[yPos + 1][xPos] > -1) mines[yPos + 1][xPos] += 1;

  if (yPos != mapHeight - 1 && xPos != mapHeight - 1)
    if (mines[yPos + 1][xPos + 1] > -1) mines[yPos + 1][xPos + 1] += 1;

  if (xPos != 0) 
    if (mines[yPos][xPos - 1] > -1) mines[yPos][xPos - 1] += 1;

  if (xPos != mapHeight - 1) 
    if (mines[yPos][xPos + 1] > -1) mines[yPos][xPos + 1] += 1;

  if (yPos != 0 && xPos != 0) 
    if (mines[yPos - 1][xPos - 1] > -1) mines[yPos - 1][xPos - 1] += 1;

  if (yPos != 0) 
    if (mines[yPos - 1][xPos] > -1) mines[yPos - 1][xPos] += 1;

  if (yPos != 0 && xPos != mapHeight - 1)
    if (mines[yPos - 1][xPos + 1] > -1) mines[yPos - 1][xPos + 1] += 1;
}

function typing() {
  for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
      var field = mines[y][x];
      if (field == 0)
        document.getElementById(y.toString() + x.toString()).innerHTML = " ";
      else if (field == -1)
        document.getElementById(y.toString() + x.toString()).innerHTML =
          "<img src='mine.png' width='20px'>";
      else
        document.getElementById(y.toString() + x.toString()).innerHTML = field;
    }
  }
}

//var checkingList = [
//     mines[y - 1][x - 1],
//     mines[y - 1][x],
//     mines[y - 1][x + 1],
//     mines[y][x - 1],
//     mines[y][x + 1],
//     mines[y + 1][x - 1],
//     mines[y + 1][x],
//     mines[y + 1][x + 1],
//   ];

//   for (let ifs = 0; ifs <= 8; ifs++) {
//     if (checkingList[ifs].x == null && checkingList[ifs].y == null)
//       console.log("Null space");
//     else {
//       checkingList[ifs] += 1;
//     }
