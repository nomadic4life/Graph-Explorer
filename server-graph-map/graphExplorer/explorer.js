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
    this.counter = 0;
    this.roomSize = roomSize;
    this.exploreStack = [];
    this.desinations = {};
  }

  async activate(explored) {
    // Initiate to explore map
    console.log("\n\t ACTIVTING >>> explore maze map <<<");

    this.visited = explored;

    this.isExplore = true;

    this.cooldown = await this.player.init(this);

    this.initializeExplore();
  }

  deactivate() {
    this.isExplore = false;
  }

  async initializeExplore() {
    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode();
    }

    const { nextMove, newGuess } = await this.nextMove();

    this.explore({ direction: nextMove, guess: newGuess });
  }

  direction() {
    return {
      n: "North",
      s: "South",
      w: "West",
      e: "East"
    };
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

  checkMapStatus(direction) {
    // might rename this func to describe what it does more accuretly
    if (this.currentStatus && direction) {
      console.log(
        `
        \n\tCurrent room ${this.currentStatus.room_id} 
        Rooms visited ${Object.keys(this.visited).length}
        There are exits to the ${this.currentStatus.exits}
        Will move to the ${this.direction()[direction]}
        Number of moves ${this.counter}\n
        `
      );
    }

    if (Object.keys(this.visited).length - 1 === this.roomSize) {
      return true;
    } else return false;
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
      this.desinations["Shop"] = room.room_id;
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

  handleNode(direction) {
    if (!this.visited[this.currentStatus.room_id]) {
      this.createNode(direction);
    } else {
      this.updateNode(direction);
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

  simpleMoveType(current) {
    for (let e of this.currentStatus.exits) {
      if (typeof current.exits[e] === "boolean" && current.exits[e] === false) {
        return e;
      }
    }
    return false;
  }

  async nextMove(direction) {
    const nextMove = this.simpleMoveType(
      this.visited[this.currentStatus.room_id]
    );

    // if (this.checkMapStatus(direction)) return {};
    // this.checkMapStatus(direction);
    console.log("\n\n>>>>>> > > >- >-  >-  -  --  -  -<  -< -< < < <<<<<\n");
    console.log(this.currentStatus);

    console.log(
      "\n\t>>>>  STACK  <<<<\n",
      this.exploreStack,
      "\n\t>>>>  STACK  <<<<\n"
    );

    if ("nswe".includes(nextMove)) {
      if (!"nswe".includes(direction)) {
        return { nextMove };
      }

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
    } else {
      if (this.exploreStack.length === 0) {
        this.searchForDestination(0);
      }

      if (this.exploreStack.length > 0) {
        const node = this.exploreStack.pop();

        const nextMove = node.enterFrom;

        const newGuess = String(node.prevRoom);
        return { nextMove, newGuess };
      }
      // if reach this point means all of map is explored and should enter into a different mode to travel the map
      // collecting gold and automating other tasks
      return {};
    }
  }

  async explore({ direction, guess }) {
    // Depth First Traversal

    if (!"nswe".includes(direction)) {
      console.log("All Rooms Explored!!!");
      return {};
    } else if (!this.isExplore) {
      return {};
    }

    this.counter++;

    this.checkMapStatus(direction);

    this.cooldown = await this.move(direction, guess);

    this.handleNode(direction);

    await this.saveStatus();

    // this.cooldown = await this.checkStatus();

    // this.cooldown = await this.takeItem();

    // this.cooldown = await this.sellItem();

    const { nextMove, newGuess } = await this.nextMove(direction);

    this.explore({
      direction: nextMove,
      guess: newGuess
    });
  }

  async stackUpPath({ visitedRooms, destination, visitedQueue }) {
    let room = destination;

    while (visitedRooms[room].enterFrom !== "start") {
      this.exploreStack.push({
        prevRoom: room,
        enterFrom: visitedRooms[room].enterFrom
      });

      room = visitedRooms[room].prevRoom;
    }
    // send visitedQueue and desination and visitedRooms to client
    // const { nextMove: direction, newGuess: guess } = await this.nextMove();
    // setTimeout(() => this.explore({ direction, guess }), this.cooldown);
  }

  searchForDestination(destination = false) {
    const start = this.currentStatus.room_id;

    const visitedRooms = {};

    let node = {
      room_id: start,
      exits: this.visited[start].exits,
      move: "start"
    };

    let prevRoom = null;

    let room = node;

    const searchQueue = [];

    const visitedQueue = [];

    searchQueue.push(node);

    visitedQueue.push(start);

    while (searchQueue.length >= 1) {
      prevRoom = room.room_id;

      room = searchQueue.pop();

      visitedQueue.push(room.room_id);

      visitedRooms[room.room_id] = {
        enterFrom: room.move,
        // I think I need fix this???
        prevRoom: String(room.exits[this.reverseDirection(room.move)]) || null
      };

      if (room.room_id === destination) {
        destination = destination === false ? prevRoom : destination;
        return this.stackUpPath({ visitedRooms, destination, visitedQueue });
      }

      const neighbors = room.exits;

      for (let e in neighbors) {
        if (String(neighbors[e]) !== null && !visitedRooms[neighbors[e]]) {
          let node = {
            room_id: neighbors[e],
            exits:
              this.visited[neighbors[e]] === undefined
                ? { empty: null }
                : this.visited[neighbors[e]].exits || { empty: null },
            move: e
          };

          searchQueue.unshift(node);
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
