const fs = require("fs");
const path = require("path");
// import generateMaze from "./mazeGenerator/mazeGenerator.js";
function findTreasureSync(roomPath) {
  if (fs.readFileSync("./map.txt").toString().includes(":moneybag:")) {
    return;
  }
  const arrayOfFiles = fs.readdirSync(`${roomPath}`);
  const contentOfMap = fs.readFileSync(`./map.txt`).toString();
  arrayOfFiles.forEach(file => {
    if (
      path.extname(file) === ".json" &&
      !contentOfMap.includes(roomPath + file + "/")
    ) {
      checkContent(roomPath + file);
    } else {
      findTreasureSync(roomPath + file + "/");
    }
  });
}
function checkContent(chestPath) {
  const content = fs.readFileSync(chestPath).toString();
  try {
    const chest = JSON.parse(content);
    if (chest.hasOwnProperty("treasure")) {
      console.log(`treasure found at ${chestPath}`);
      drawMapSync(chestPath + "/" + ":moneybag:");
      return;
    } else {
      const goodPath = checkIfValidPath(chest);
      if (goodPath) {
        drawMapSync(chestPath + "/");
        findTreasureSync(chest.clue + "/");
      }
      return;
    }
  } catch (error) {
    // not json
    return;
  }
}
function checkIfValidPath(chest) {
  try {
    fs.readdirSync(chest.clue + "/");
    return true;
  } catch (error) {
    return false;
  }
}
resetMap();
findTreasureSync("./maze/");
// findTreasureSync(generateMaze());
function drawMapSync(path) {
  const content = fs.readFileSync("./map.txt").toString();
  fs.writeFileSync("./map.txt", `${content}\n${path}`);
}
function resetMap(path) {
  fs.writeFileSync("./map.txt", ``);
}
