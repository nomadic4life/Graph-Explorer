const Explorer = require("./explorer");
const jsonfile = require("jsonfile");
const file = "./graphExplorer/data.json";

class Team {
  constructor(room) {
    this.explored = {};
    this.members = {};
    this.roomSize = room.size;
  }

  addMember(member) {
    const player = new Explorer(member, this.explored, this.roomSize);
    this.members[member.uuid] = player;
  }

  async explore(playerUUID) {
    this.explored = (await this.updateExplored()) || {};
    this.members[playerUUID].activate(this.explored);
  }

  stopExplore(playerUUID) {
    this.members[playerUUID].deactivate();
  }

  updateExplored() {
    return jsonfile
      .readFile(file)
      .then(obj => {
        return obj;
      })
      .catch(error => console.error("logging error", error));
  }
}

module.exports = Team;
