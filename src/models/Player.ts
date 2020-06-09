class Player {
  private _username: string;
  private _kills: number;

  constructor(name: string) {
    this._username = name;
    this._kills = 0;
  }

  username() {
    return this._username;
  }

  kills() {
    return this.deathsNumber();
  }

  addKill() {
    this._kills += 1;
    return this;
  }

  diedToTheWorld() {
    this._kills -= 1;
    return this;
  }

  updateUsername(username: string) {
    this._username = username;
    return this;
  }

  toObject() {
    return {
      username: this._username,
      kills: this.deathsNumber(),
    };
  }

  private deathsNumber() {
    return this._kills > 0 ? this._kills : 0;
  }
}

export default Player;
