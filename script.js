const width = 10;
const height = 10;


function run() {
  createTable(width,height);
 
}

function createTable(tableWidth, tableHeight) {
  var output = String();
  for (y = 0; y < tableHeight; y++) {
    output += "<tr>";
    for (x = 0; x < tableWidth; x++) {
      output += "<td class='cell' id='" + y.toString() + x.toString() + "' style='background:lightgrey' onclick='cellVanish("+y+","+x+")'></td>";
    }
    output += "</tr>";
  }
  document.getElementById("fu").innerHTML =
    "<table>" + output + "</table>";
}


function cellVanish(y,x) {
  //console.log(x,y)
  document.getElementById(y.toString() + x.toString()).style='background:white';
}