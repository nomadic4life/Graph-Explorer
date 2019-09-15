const Action = require("./actions");
const jsonfile = require("jsonfile");
const file = "./graphExplorer/data.json";

class Explorer {
  constructor(explorer, visited, roomSize) {
    this.player = new Action(explorer);
    this.isExplore = false;
    this.visited = visited;
    this.currentStatus = null;
    this.prevStatus = null;
    this.roomSize = roomSize;
    this.exploreStack = [];
  }

  async move(direction, guess) {
    if (!"nswe".includes(direction)) return "invalid direction";

    if (guess) {
      return await this.player.wiseMove(direction, guess);
    } else {
      return await this.player.move(direction);
    }
  }

  async initCurrentStatus(cb) {
    this.currentStatus = await this.player.init();
    cb();
  }

  activate(explored) {
    // explore map
    this.visited = explored;
    this.isExplore = true;

    this.initCurrentStatus(() => {
      setTimeout(
        () => this.explore(this.initiateStartMove()),
        this.currentStatus.cooldown * 1000
      );
    });
  }

  initiateStartMove() {
    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode();
    }
    const current = this.visited[this.currentStatus.room_id];
    const hasUnvisitedNeighbors = this.simpleMoveType(current);
    if ("nswe".includes(hasUnvisitedNeighbors)) {
      return { direction: hasUnvisitedNeighbors };
    } else {
      // const direction = this.bft(current);
      // return { direction };
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

  checkMapStatus() {
    if (Object.keys(this.visited).length === this.roomSize) {
      return true;
    } else return false;
  }

  async nextMove(direction) {
    const nextMove = this.simpleMoveType(
      this.visited[this.currentStatus.room_id]
    );

    console.log(nextMove);
    console.log(this.exploreStack);

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

  async explore({ direction, guess }) {
    // Depth First Traversal
    console.log(
      `
      \n\tcurrent room ${this.currentStatus.room_id} 
      \twill move to the ${direction} 
      \tthere are exits to the ${this.currentStatus.exits}
      \trooms visited ${Object.keys(this.visited).length}\n
      `
    );
    if (this.checkMapStatus()) return "Map is fully explored!";

    this.prevStatus = this.currentStatus;
    this.currentStatus = await this.move(direction, guess);

    if (this.currentStatus.room_id === this.prevStatus.room_id) {
      setTimeout(() => {
        this.explore({
          direction,
          guess
        });
      }, this.currentStatus.cooldown * 1500);
      return;
    }

    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode(direction);
    } else {
      this.updateNode(direction);
    }
    // console.log(this.currentStatus);
    // await this.saveStatus();

    const { nextMove, newGuess } = await this.nextMove(direction);
    if (this.isExplore && nextMove) {
      this.checkRoom(() => {
        setTimeout(
          () =>
            this.explore({
              direction: nextMove,
              guess: newGuess ? String(newGuess) : undefined
            }),
          this.currentStatus.cooldown * 1000
        );
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
        return this.visited[neighbor].exits[direction] === false;
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
        if (!visitedRooms[neighbors[e]]) {
          let node = {
            room_id: neighbors[e],
            exits: this.visited[neighbors[e]].exits,
            move: e
          };
          path.push(node);
          paths[neighbors[e]] = [...path];
          path.pop();
          searchQueue.unshift(node);
        } else {
          path = [...paths[room.room_id]];
        }

        if (this.searchType(searchType, destination, neighbors[e], e)) {
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
          this.currentStatus.items.shift()
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
