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

  async init(update, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "GET",
      url: "/adv/init/"
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async move(update, direction, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async wiseMove(update, direction, next_room_id, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction, next_room_id }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async take(update, name, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/take/",
      data: { name }
    })
      .then(async res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async drop(update, name, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/drop/",
      data: { name }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
        return update(res, "err");
      });
  }

  async sell(update, name, confirm, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/sell/",
      data: { name, confirm }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async status(update, cooldown) {
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
        return update(res, "err");
      });
  }

  async examine(update, name, cooldown) {
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
        return update(res, "err");
      });
  }

  async wear(update, name, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/wear/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async changeName(update, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/change_name/",
      data: { name: this.name }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async pray(update, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/pray/"
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async fly(update, direction, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/fly/",
      data: { direction }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async dash(update, direction, num_rooms, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/dash/",
      data: { direction, num_rooms }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async carry(update, name, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/carry/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async receive(update, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/receive/"
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async mine(update, newProof, cooldown) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/mine/",
      data: { proof: newProof }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async getLastProof(update, cooldown) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "GET",
      url: "/adv/bc/last_proof/"
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async getBalance(update, cooldown) {
    await this.sleep(cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/get_balance/"
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }

  async transmogrify(update, name, cooldown) {
    await this.sleep(cooldown);
    return this.request({
      method: "POST",
      url: "/adv/transmogrify/",
      data: { name: [name] }
    })
      .then(res => {
        return update(res, "room");
      })
      .catch(err => {
        console.log(err);
        return update(res, "err");
      });
  }
}

module.exports = Actions;
