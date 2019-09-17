const Action = require("./actions");
const jsonfile = require("jsonfile");
const file = "./graphExplorer/data.json";

class Explorer {
  constructor(explorer, visited, roomSize) {
    this.player = new Action(explorer);
    this.isExplore = false;
    this.visited = visited;
    this.cooldown = 5000;
    this.currentStatus = null;
    this.currentPlayerStatus = null;
    this.prevStatus = null;
    this.roomSize = roomSize;
    this.exploreStack = [];
  }

  async move(direction, guess) {
    if (!"nswe".includes(direction)) return "invalid direction";

    this.prevStatus = this.currentStatus;

    if (guess) {
      return await this.player.wiseMove(this, direction, guess);
    } else {
      // console.log(this.currentStatus);
      return await this.player.move(this, direction);
    }
  }

  updateStatus(response, status, type) {
    if (type === "room") {
      status.currentStatus = response.data;
    } else if (type === "player") {
      status.currentPlayerStatus = response.data;
    } else if (type === "object") {
      // status = response.data;
    } else if (type === "err") {
      // status = response;
    }
    return response.data.cooldown * 1000;
  }

  async activate(explored) {
    // explore map
    console.log("\n\t ACTIVTING >>> explore maze map <<<");
    this.visited = explored;

    this.isExplore = true;
    this.cooldown = await this.player.init(this);
    console.log(
      this.currentStatus.room_id,
      this.visited[this.currentStatus.room_id]
    );

    //  - 426
    //  + 318
    //  + 199
    this.search(this.currentStatus.room_id, 233, "room_id", path =>
      console.log(path)
    );

    // if (this.checkMapStatus()) return this.currentStatus.room_id;
    // const move = await this.initiateStartMove();
    // this.explore(move);
  }

  direction() {
    return {
      n: "North",
      s: "South",
      w: "West",
      e: "East"
    };
  }

  async initiateStartMove() {
    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode();
    }

    const current = this.visited[this.currentStatus.room_id];

    const hasUnvisitedNeighbors = this.simpleMoveType(current);

    if ("nswe".includes(hasUnvisitedNeighbors)) {
      return { direction: hasUnvisitedNeighbors, guess: undefined };
    } else {
      console.log("searching for closest unvisted neighbor");

      return this.search(current.room_id, false, "neighbor", path => {
        path.shift();

        for (let element of path) {
          this.exploreStack.unshift({
            enterFrom: element.move,
            prevRoom: element.room_id
          });
        }

        const node = this.exploreStack.pop();

        const nextMove = node.enterFrom;

        const newGuess = node.prevRoom;

        return { direction: nextMove, guess: String(newGuess) };
      });
    }
  }

  simpleMoveType(current) {
    for (let e of this.currentStatus.exits) {
      if (typeof current.exits[e] === "boolean" && current.exits[e] === false) {
        return e;
      }
    }
    return false;
  }

  createNode(direction) {
    const room = {
      room_id: this.currentStatus.room_id,
      title: this.currentStatus.title,
      description: this.currentStatus.description,
      coordinates: this.currentStatus.coordinates,
      elevation: this.currentStatus.elevation,
      terrain: this.currentStatus.terrain,
      exits: this.setExits(direction)
    };

    this.visited[room.room_id] = room;

    if (room.title === "Shop") {
      this.visited["Shop"] = room.room_id;
    }
  }

  reverseDirection(direction) {
    const reverse = {
      n: "s",
      s: "n",
      w: "e",
      e: "w"
    };
    return reverse[direction];
  }

  setExits(direction) {
    const exits = {};

    if (direction) {
      exits[this.reverseDirection(direction)] = this.prevStatus.room_id;
      this.visited[this.prevStatus.room_id].exits[
        direction
      ] = this.currentStatus.room_id;
    }

    for (let e of this.currentStatus.exits) {
      exits[e] =
        exits[e] === undefined || exits[e] === false ? false : exits[e];
    }

    return exits;
  }

  deactivate() {
    this.isExplore = false;
  }

  checkMapStatus(direction) {
    if (this.currentStatus && direction) {
      console.log(
        `
        \n\tCurrent room ${this.currentStatus.room_id} 
        Rooms visited ${Object.keys(this.visited).length}
        There are exits to the ${this.currentStatus.exits}
        Will move to the ${this.direction()[direction]}\n
        `
      );
    }

    if (Object.keys(this.visited).length - 1 === this.roomSize) {
      return true;
    } else return false;
  }

  updateNode(direction) {
    if (
      direction &&
      this.visited[this.currentStatus.room_id].exits[
        this.reverseDirection(direction)
      ] === false
    ) {
      this.visited[this.currentStatus.room_id].exits[
        this.reverseDirection(direction)
      ] = this.prevStatus.room_id;
      this.visited[this.prevStatus.room_id].exits[
        direction
      ] = this.currentStatus.room_id;
    }
  }

  saveStatus() {
    return jsonfile
      .writeFile(file, this.visited)
      .then(res => {
        return res;
      })
      .catch(error => console.error(error));
  }

  async nextMove(direction) {
    const nextMove = this.simpleMoveType(
      this.visited[this.currentStatus.room_id]
    );

    // if (this.checkMapStatus(direction)) return {};
    this.checkMapStatus(direction);
    console.log("\n\n>>>>>> > > >- >-  >-  -  --  -  -<  -< -< < < <<<<<\n");
    console.log(this.currentStatus);

    console.log(
      "\n\t>>>>  STACK  <<<<\n",
      this.exploreStack,
      "\n\t>>>>  STACK  <<<<\n"
    );

    if ("nswe".includes(nextMove)) {
      if (this.exploreStack.length === 0) {
        this.exploreStack.push({
          enterFrom: this.reverseDirection(direction),
          prevRoom: this.prevStatus.room_id
        });
      }

      this.exploreStack.push({
        enterFrom: this.reverseDirection(nextMove),
        prevRoom: this.currentStatus.room_id
      });

      return { nextMove };
    } else if (this.exploreStack.length > 0) {
      const node = this.exploreStack.pop();

      const nextMove = node.enterFrom;

      const newGuess = node.prevRoom;

      return { nextMove, newGuess };
    } else {
      return await this.search(
        this.currentStatus.room_id,
        false,
        "neighbor",
        path => {
          if (path === undefined) return;
          path.shift();

          for (let element of path) {
            this.exploreStack.unshift({
              enterFrom: element.move,
              prevRoom: element.room_id
            });
          }

          const node = this.exploreStack.pop();

          const nextMove = node.enterFrom;

          const newGuess = node.prevRoom;

          return { nextMove, newGuess };
        }
      );
    }
  }

  async explore({ direction, guess }) {
    // Depth First Traversal

    this.checkMapStatus(direction);
    this.cooldown = await this.move(direction, guess);

    await this.saveStatus();

    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode(direction);
    } else {
      this.updateNode(direction);
    }

    // this.cooldown = await this.checkStatus();

    // this.cooldown = await this.takeItem();

    // this.cooldown = await this.sellItem();

    const { nextMove, newGuess } = await this.nextMove(direction);
    if (this.isExplore && nextMove) {
      this.explore({
        direction: nextMove,
        guess: newGuess ? String(newGuess) : undefined
      });
    }
  }

  initiateBFT() {
    this.initCurrentStatus(() => {
      this.searchForDesination(this.currentStatus.room_id, 0, "room_id");
    });
  }

  searchType(type, destination, neighbor, direction) {
    switch (type) {
      case "room_id":
        return neighbor === destination;
      case "title":
        return this.visited[neighbor].title === destination;
      case "neighbor":
        return neighbor === destination;
      default:
        return false;
    }
  }

  search(start, destination, searchType, cb) {
    return cb(this.searchForDesination(start, destination, searchType));
  }

  searchForDesination(start, destination, searchType) {
    const searchQueue = [];
    const visitedRooms = {};
    let node = {
      room_id: start,
      exits: this.visited[start].exits,
      move: "start"
    };
    searchQueue.push(node);
    const paths = {};
    let path = [];
    while (searchQueue.length >= 1) {
      const room = searchQueue.pop();
      path.push(room);
      visitedRooms[room.room_id] = true;
      const neighbors = room.exits;
      for (let e in neighbors) {
        if (!visitedRooms[neighbors[e]] && neighbors[e] !== false) {
          let node = {
            room_id: neighbors[e],
            exits: this.visited[neighbors[e]].exits,
            move: e
          };
          path.push(node);
          // console.log(path);
          paths[neighbors[e]] = [...path];
          path.pop();
          searchQueue.unshift(node);
        } else if (neighbors[e] !== false) {
          // if (searchType === "room_id")
          // 483
          // 477
          // 443
          // 388
          // 257
          // 425
          // 165
          // if (room.room_id === 165)
          //   console.log(room.room_id, neighbors[e], path);
          // if (neighbors[e] === 165)
          //   console.log(room.room_id, neighbors[e], path);
          path = [...paths[room.room_id]];
        }

        // if (neighbors[e] === 257) console.log(neighbors[e], path);
        if (this.searchType(searchType, destination, neighbors[e], e)) {
          // console.log(path);
          // return path;
          return paths[destination];
        }
      }
    }
  }

  async checkRoom(cb) {
    console.log(this.currentStatus.items.length, "testing length");
    if (this.currentStatus.items.length !== 0) {
      setTimeout(async () => {
        this.currentStatus = await this.player.take(
          this.currentStatus.items.shift(),
          (cb, cooldown) => {
            setTimeout(async () => {
              await cb();
            }, cooldown);
          }
        );

        this.checkRoom(cb);
      }, this.currentStatus.cooldown * 1000);
    } else {
      console.log(this.currentStatus, "checking the current status");
      cb();
    }
  }
}

module.exports = Explorer;
