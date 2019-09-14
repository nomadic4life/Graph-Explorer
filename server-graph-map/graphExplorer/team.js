const Explorer = require("./explorer");

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

  explore(playerUUID) {
    this.members[playerUUID].activate();
  }

  stopExplore(playerUUID) {
    this.members[playerUUID].deactivate();
  }
}

module.exports = Team;
