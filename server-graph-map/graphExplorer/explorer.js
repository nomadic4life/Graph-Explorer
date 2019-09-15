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
      const direction = this.bft(current);
      return { direction };
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
    if (this.prevStatus)
      console.log(
        this.currentStatus.room_id,
        exits,
        "\n",
        this.prevStatus.room_id,
        this.visited[this.prevStatus.room_id].exits
      );
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

  nextMove(direction) {
    const nextMove = this.simpleMoveType(
      this.visited[this.currentStatus.room_id]
    );

    console.log(nextMove);
    console.log(this.exploreStack);

    // might not use this. and might implement logic to handle this edgecase in bft
    // if (this.currentStatus.exits.length === 1) {
    //   this.exploreStack.push({
    //     enterFrom: this.reverseDirection(direction),
    //     prevRoom: this.prevStatus.room_id
    //   });
    // }

    if ("nswe".includes(nextMove)) {
      console.log(nextMove, "inside of if");
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
      // implement bft???
      console.log("should do some bft here");
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
    console.log(this.visited[this.currentStatus.room_id].exits);
  }

  saveStatus() {
    console.log("saving file");
    return jsonfile
      .writeFile(file, this.visited)
      .then(res => {
        console.log("saved file");
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
    await this.saveStatus();

    const { nextMove, newGuess } = this.nextMove(direction);
    if (this.isExplore && nextMove) {
      setTimeout(
        () =>
          this.explore({
            direction: nextMove,
            guess: newGuess ? String(newGuess) : undefined
          }),
        this.currentStatus.cooldown * 1000
      );
    }
  }

  initiateBFT() {
    this.initCurrentStatus(() => {
      this.bft(this.currentStatus.room_id, 0);
    });
  }

  searchType(type = "room_id") {
    // type
    //  room_id
    //  title
    //  exit === false
  }

  bft(start, destination, options) {
    const searchQueue = [];
    const visitedRooms = {};
    searchQueue.push(start);

    const paths = {};
    let path = [];
    while (searchQueue.length >= 1) {
      const room = searchQueue.pop();
      path.push(room);
      visitedRooms[room] = true;
      const neighbors = this.visited[room].exits;
      for (let e in neighbors) {
        if (!visitedRooms[neighbors[e]]) {
          path.push(neighbors[e]);
          paths[neighbors[e]] = [...path];
          path.pop();
          searchQueue.unshift(neighbors[e]);
        } else {
          path = [...paths[room]];
        }

        if (this.searchType(options, destination, neighbors[e])) {
          return paths[destination];
        }
      }
    }
  }
}

module.exports = Explorer;
