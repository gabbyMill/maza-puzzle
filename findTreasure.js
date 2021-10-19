const fs = require("fs");
const path = require("path");

const mazeStartingPoint = "./new-maze-folder";
fs.rmSync(mazeStartingPoint, { recursive: true, force: true });

const { generateMaze } = require("./mazeGenerator/mazeGenerator.js");

function findTreasureSync(roomPath) {
  if (fs.readFileSync("./map.txt").toString().includes("💰")) {
    return;
  }
  const arrayOfFiles = fs.readdirSync(`${roomPath}`);
  const contentOfMap = fs.readFileSync(`./map.txt`).toString();
  arrayOfFiles.forEach(file => {
    if (
      path.extname(file) === ".json" &&
      !contentOfMap.includes(roomPath + file + "/")
    ) {
      openChestSync(roomPath + file);
    } else {
      findTreasureSync(roomPath + file + "/");
    }
  });
}

function openChestSync(chestPath) {
  // chest path is the path to a json file
  const content = fs.readFileSync(chestPath).toString();
  try {
    const chest = JSON.parse(content);
    if (chest.hasOwnProperty("treasure")) {
      // console.log(`treasure found at ${chestPath}`);
      drawMapSync(chestPath + "/" + "💰");
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
generateMaze(`${mazeStartingPoint}`, 3, 4, 9);
findTreasureSync(`${mazeStartingPoint}/`);
function drawMapSync(path) {
  const content = fs.readFileSync("./map.txt").toString();
  fs.writeFileSync("./map.txt", `${content}\n${path}`);
}
function resetMap(path) {
  fs.writeFileSync("./map.txt", ``);
}
