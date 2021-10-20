const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

const mazeStartingPoint = "./new-maze-folder";
fs.rmSync(mazeStartingPoint, { recursive: true, force: true });

const { generateMaze } = require("./mazeGenerator/mazeGenerator.js");

async function promiseTreasure(roomPath) {
  const encodedMap = await fsPromises.readFile("./map.txt");
  const mapText = encodedMap.toString();
  if (mapText.includes("💰")) {
    return;
  }
  const arrayOfFiles = await fsPromises.readdir(`${roomPath}`);
  arrayOfFiles.forEach(file => {
    if (
      path.extname(file) === ".json" &&
      !mapText.includes(roomPath + file + "/")
    ) {
      promiseOpenChest(roomPath + file);
    } else {
      promiseTreasure(roomPath + file + "/");
    }
  });
}
async function promiseOpenChest(chestPath) {
  // chest path is the path to a json file
  const encodedContent = await fsPromises.readFile(chestPath);
  const content = encodedContent.toString();
  try {
    const chest = JSON.parse(content);
    if (chest.hasOwnProperty("treasure")) {
      // console.log(`treasure found at ${chestPath}`);
      await drawMapASync(chestPath + "/" + "💰");
      return;
    } else {
      const goodPath = await checkIfValidPath(chest);
      if (goodPath) {
        await drawMapASync(chestPath + "/"); // works without await, right ?
        await promiseTreasure(chest.clue + "/"); // works without await, right ?
      }
      return;
    }
  } catch (error) {
    // not json
    return;
  }
}
async function checkIfValidPath(chest) {
  const checkPath = fsPromises.readdir(chest.clue + "/");
  return checkPath.then(() => true).catch(() => false);
}
resetMap();
generateMaze(`${mazeStartingPoint}`, 3, 4, 9);
promiseTreasure(`./maze/`);
// draw map sync
async function drawMapASync(path) {
  const encodedContent = await fsPromises.readFile("./map.txt");
  const content = encodedContent.toString();
  await fsPromises.writeFile("./map.txt", `${content}\n${path}`);
}
//resetmap
async function resetMap(path) {
  await fsPromises.writeFile("./map.txt", ``);
}
