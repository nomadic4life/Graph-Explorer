const Action = require("./action");

class Explorer {
  constructor(explorer, visited, roomSize) {
    this.player = new Action(explorer);
    this.visited = visited;
    this.currentStatus = this.player.init();
    this.prevStatus = null;
    this.roomSize = roomSize;
  }

  move(direction, guess) {
    if (!"nswe".includes(direction)) return "invalid direction";

    if (guess) {
      return this.player.wiseMove(direction, guess);
    } else {
      return this.player.move(direction);
    }
  }

  activate() {
    // explore map

    setTimeout(
      () => this.dft(this.initiateNextMove()),
      this.currentStatus.cooldown
    );
  }

  initiateNextMove(direction) {
    this.createNode(direction);
    current = this.visited[this.currentStatus.room_id];
    return this.simpleMoveType(current);
  }

  simpleMoveType(current) {
    for (e of this.currentStatus.exits) {
      if (current.exits[e]) {
        return current.exits[e];
      }
    }
  }

  createNode(direction) {
    room = {
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
    if (direction && this.visited[this.currentStatus.room_id] === undefined) {
      exits[this.reverseDirection(direction)] = this.prevStatus.room_id;
    }
    for (i = 0; i < this.currentStatus.exits; i++) {
      exits[this.currentStatus.exits[i]] = exits[i] || false;
    }

    return exits;
  }

  deactivate() {}

  checkMapStatus() {
    if (Object.keys(this.visited).length === this.roomSize) {
      return true;
    } else return false;
  }

  dft(direction, guess) {
    if (this.checkMapStatus()) return "Map is fully explored!";
  }

  bft() {}
}

module.exports = Explorer;
