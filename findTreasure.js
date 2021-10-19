const fs = require("fs");
const path = require("path");

let flag = false;

// const something = fs.lstatSync("./maze/room-0").isFile();
// console.log("something: ", something);

function findTreasureSync(roomPath) {
  // if (flag) return;
  if (fs.readFileSync("./map.txt").toString().includes("💰")) {
    console.log("Function supposed to finish here!");
    return;
  }
  const arrayOfFiles = fs.readdirSync(roomPath);
  const contentOfMap = fs.readFileSync(`./map.txt`).toString();
  arrayOfFiles.forEach(file => {
    if (
      path.extname(file) === ".json" && // if json
      !contentOfMap.includes(roomPath + file + "/") // if this json is not in map
    ) {
      const chest = checkContent(roomPath + file); // will only be called with json
      if (chest === "treasure") {
        // flag = true;
        // fs.writeFileSync("./result.txt", `${roomPath}${file}`);
        // fs.writeFileSync("./map.txt", "💰");
        // console.log(fs.readFileSync("./map.txt").toString());
        console.log("treasure found stop function here"); // stop function here
        return;
      }
      drawMapSync(roomPath + file);
    } else {
      // there is a problem here, this could not be a
      // directory but a json file that was previously opened
      console.log("else");
      findTreasureSync(roomPath + file + "/");
    }
  });
}

function checkContent(chestPath) {
  const content = fs.readFileSync(chestPath).toString();
  try {
    const chest = JSON.parse(content);
    if (chest.hasOwnProperty("treasure")) {
      // checks for treasure
      return "treasure"; // Call some treasureFound function here
    }
    // validation:
    const isValid = checkIfValidPath(chest); // maybe return this ?
    console.log("isValid: ", isValid);
    if (!isValid) {
      console.log("is probably bad path");
      // do something here
    }
    return;
  } catch (error) {
    console.log("invalid, not json");
    return false;
  }
}

resetMap();
findTreasureSync("./maze/");

function checkIfValidPath(chest) {
  try {
    console.log("chest: ", chest.clue);
    const isDir = fs.lstatSync(chest.clue).isDir();
    console.log("isDir: ", isDir);
    const isFile = fs.lstatSync(chest.clue).isFile();
    console.log("isFile: ", isFile);
    findTreasureSync(chest.clue + "/"); // better way for checking for path ?
  } catch (error) {
    console.log("bad path");
    return false;
  }
}

function drawMapSync(path) {
  const content = fs.readFileSync("./map.txt").toString();
  fs.writeFileSync("./map.txt", `${content}\n${path}`);
}

function resetMap(path) {
  fs.writeFileSync("./map.txt", ``);
}
