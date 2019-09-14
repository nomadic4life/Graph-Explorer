const axios = require("axios");

class Player {
  constructor(player) {
    this.name = player.name;
    this.uuid = player.uuid;
    this.request = axios.create({
      baseURL: player.URL || "http://localhost:8000/api",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.uuid}`
      }
    });
    this.mineRequest = axios.create({
      baseURL: player.mineURL || "http://localhost:3000/api",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.uuid}`
      }
    });
  }

  init() {
    return this.request({
      method: "GET",
      url: "/adv/init/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  move(direction) {
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  wiseMove(direction, next_room_id) {
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction, next_room_id }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  take(name) {
    return this.request({
      method: "POST",
      url: "/adv/take/",
      data: { name }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  drop(name) {
    return this.request({
      method: "POST",
      url: "/adv/drop/",
      data: { name }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  sell(name, confirm) {
    return this.request({
      method: "POST",
      url: "/adv/sell/",
      data: { name, confirm }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  status() {
    return this.request({
      method: "POST",
      url: "/adv/status/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  examine(name) {
    return this.request({
      method: "POST",
      url: "/adv/examine/",
      data: { name: [name] }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  wear(name) {
    return this.request({
      method: "POST",
      url: "/adv/wear/",
      data: { name: [name] }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  changeName() {
    return this.request({
      method: "POST",
      url: "/adv/change_name/",
      data: { name: this.name }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  pray() {
    return this.request({
      method: "POST",
      url: "/adv/pray/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  fly(direction) {
    return this.request({
      method: "POST",
      url: "/adv/fly/",
      data: { direction }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  dash(direction, num_rooms) {
    return this.request({
      method: "POST",
      url: "/adv/dash/",
      data: { direction, num_rooms }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  carry(name) {
    return this.request({
      method: "POST",
      url: "/adv/carry/",
      data: { name: [name] }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  receive() {
    return this.request({
      method: "POST",
      url: "/adv/receive/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  mine(newProof) {
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/mine/",
      data: { proof: newProof }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getLastProof() {
    return this.mineRequest({
      method: "GET",
      url: "/adv/bc/last_proof/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getBalance() {
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/get_balance/"
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  transmogrify(name) {
    return this.request({
      method: "POST",
      url: "/adv/transmogrify/",
      data: { name: [name] }
    })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
