const fs = require("fs");
const path = require("path");

const mazeStartingPoint = "./new-maze-folder";
fs.rmSync(mazeStartingPoint, { recursive: true, force: true });

const { generateMaze } = require("./mazeGenerator/mazeGenerator.js");

function callBack(err, data) {
  if (err) {
    console.log("Error: ", err);
    return;
  } else {
    return data; // I think this is useless but not sure yet
  }
}

function findTreasure(roomPath) {
  fs.readFile("./map.txt", (err, contentOfMap) => {
    if (err) {
      console.log("Cant read map");
      return callBack(err); // in all return callbacks below this one
      // it was also possible to do
      // callBack(err) // go down a line
      // return
    }
    if (contentOfMap.toString().includes("💰")) {
      return; // treasure found right here baby
    }
    fs.readdir(`${roomPath}`, (err, arrayOfFiles) => {
      if (err) {
        console.log("Can't open directory");
        return callBack(err);
      }
      fs.readFile(`./map.txt`, (err, contentOfMap) => {
        if (err) {
          console.log("Cant read map");
          return callBack(err);
        }
        arrayOfFiles.forEach(file => {
          if (
            path.extname(file) === ".json" &&
            !contentOfMap.includes(roomPath + file + "/")
          ) {
            openChest(roomPath + file, function (err) {
              if (err) {
                console.log("Failed in opening chest");
                return callBack(err);
              }
            }); // needs callback ?
          }
        });
      });
    });
  });
}

function openChest(chestPath) {
  // chest path is the path to a json file
  const content = fs.readFile(chestPath, (err, content) => {
    if (err) {
      console.log("Error in opening json file");
      return callBack(err);
    }
    try {
      const chest = JSON.parse(content);
      if (chest.hasOwnProperty("treasure")) {
        // console.log(`treasure found at ${chestPath}`);
        drawMap(chestPath + "/" + "💰");
        return;
      } else {
        const goodPath = checkIfValidPath(chest);
        if (goodPath) {
          drawMap(chestPath + "/");
          findTreasure(chest.clue + "/");
        }
        return;
      }
    } catch (error) {
      // not json
      return;
    }
  });
}
function checkIfValidPath(chest) {
  try {
    fs.readdirSync(chest.clue + "/"); // haven't changed this yet, maybe don't need to
    return true;
  } catch (error) {
    return false;
  }
}
resetMap();
generateMaze(`${mazeStartingPoint}`, 2, 6, 4);
findTreasure(`${mazeStartingPoint}/`);
function drawMap(path) {
  fs.readFile("./map.txt", (err, content) => {
    if (err) {
      console.log("Unable to access map.txt");
      return callBack(err);
    }
    fs.writeFile("./map.txt", `${content}\n${path}`, err => {
      if (err) {
        console.log("Problem with map.txt");
        return callBack(err);
      }
    });
  });
}

function resetMap(path) {
  fs.writeFileSync("./map.txt", ``);
}
