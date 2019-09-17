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

  async init(ref) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "GET",
      url: "/adv/init/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async move(ref, direction) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async wiseMove(ref, direction, next_room_id) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/move/",
      data: { direction, next_room_id }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async take(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/take/",
      data: { name }
    })
      .then(async res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async drop(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/drop/",
      data: { name }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
        return update(res, "err");
      });
  }

  async sell(ref, name, confirm) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/sell/",
      data: { name, confirm }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async status(ref) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/status/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "player");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async examine(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/examine/",
      data: { name: [name] }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async wear(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/wear/",
      data: { name: [name] }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async changeName(ref) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/change_name/",
      data: { name: this.name }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async pray(ref) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/pray/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async fly(ref, direction) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/fly/",
      data: { direction }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async dash(ref, direction, num_rooms) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/dash/",
      data: { direction, num_rooms }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async carry(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/carry/",
      data: { name: [name] }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async receive(ref) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/receive/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async mine(ref, newProof) {
    await this.sleep(ref.cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/mine/",
      data: { proof: newProof }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async getLastProof(ref) {
    await this.sleep(ref.cooldown);
    return this.mineRequest({
      method: "GET",
      url: "/adv/bc/last_proof/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async getBalance(ref) {
    await this.sleep(ref.cooldown);
    return this.mineRequest({
      method: "POST",
      url: "/adv/bc/get_balance/"
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }

  async transmogrify(ref, name) {
    await this.sleep(ref.cooldown);
    return this.request({
      method: "POST",
      url: "/adv/transmogrify/",
      data: { name: [name] }
    })
      .then(res => {
        return ref.updateStatus(res, ref, "room");
      })
      .catch(err => {
        console.log(err);
        return ref.updateStatus(err, ref, "err");
      });
  }
}

module.exports = Actions;
