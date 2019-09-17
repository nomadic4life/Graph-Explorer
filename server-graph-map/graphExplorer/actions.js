const axios = require("axios");

// channels_client.trigger('channel-1', 'test_event', { message: "hello world" });

class Actions {
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

  async sleep(stallTime = 6000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  }

  async init(update, status, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "GET",
      url: "/adv/init/"
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async move(update, status, cooldown, direction) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async wiseMove(update, status, cooldown, direction, next_room_id) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction, next_room_id }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async take(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/take/",
      data: { name }
    })
      .then(async res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async drop(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/drop/",
      data: { name }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
        return update(res, "err");
      });
  }

  async sell(update, status, cooldown, name, confirm) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/sell/",
      data: { name, confirm }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async status(update) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/status/"
    })
      .then(res => {
        return update(res, "player");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async examine(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/examine/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, "object");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async wear(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/wear/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async changeName(update) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/change_name/",
      data: { name: this.name }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async pray(update) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/pray/"
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async fly(update, status, cooldown, direction) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/fly/",
      data: { direction }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async dash(update, status, cooldown, direction, num_rooms) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/dash/",
      data: { direction, num_rooms }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async carry(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/carry/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async receive(update) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/receive/"
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async mine(update, status, cooldown, newProof) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/mine/",
      data: { proof: newProof }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async getLastProof(update) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "GET",
      url: "/adv/bc/last_proof/"
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async getBalance(update) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/get_balance/"
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }

  async transmogrify(update, status, cooldown, name) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/transmogrify/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, status, "room");
      })
      .catch(err => {
        console.log(err);
        return update(err, status, "err");
      });
  }
}

module.exports = Actions;
