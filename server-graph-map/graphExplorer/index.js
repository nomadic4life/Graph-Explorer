const Team = require("./team");

const testTeam = new Team({ size: 500 });

testTeam.addMember({
  name: "Nomadic",
  uuid: "956134b0f6795e31826098f7c7e9b37f7ecee4a1"
});

const test = async () => {
  const member = testTeam.members["956134b0f6795e31826098f7c7e9b37f7ecee4a1"];
  //   const data = await member.player.init();
  //   const move = await member.activate();
  const move = await testTeam.explore(
    "956134b0f6795e31826098f7c7e9b37f7ecee4a1"
  );

  //   const move = await member.move("s");
  //   console.log(move);
};

test();

// testTeam.updateExplored();
