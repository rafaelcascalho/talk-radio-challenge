import Player from './Player';
import { WORLD_ID } from '../constants';
import { Kills, Players, Disconnected } from '../../types';

class Game {
  private totalKills: number;
  private _players: Players;
  private disconnectedPlayers: Disconnected;

  constructor() {
    this.totalKills = 0;
    this._players = {};
    this.disconnectedPlayers = {};
  }

  addKill(killerId: number, deadId: number) {
    this.totalKills++;

    const suicide = killerId === deadId;
    if (suicide) {
      return this;
    }

    const isWorld = killerId === WORLD_ID;
    if (isWorld) {
      this._players[deadId].diedToTheWorld();
    } else {
      this._players[killerId].addKill();
    }
    return this;
  }

  addPlayer(playerId: number, player: Player) {
    const reconnected = this.reconnectPlayer(playerId, player.username());
    if (reconnected) {
      return this;
    }

    let playerFound = this._players[playerId];
    if (!playerFound) {
      this._players[playerId] = player;
      return this;
    }

    const sameName = playerFound.username() === player.username();
    if (sameName) {
      return this;
    }

    playerFound.updateUsername(player.username());
    return this;
  }

  disconnectPlayer(playerId: number) {
    let player = this._players[playerId];
    this.disconnectedPlayers[player.username()] = player;
    return this;
  }

  toObject() {
    const players = [
      ...Object.values(this._players),
      ...Object.values(this.disconnectedPlayers),
    ];

    let usernames = players.map((player) => player.username());
    usernames = [...new Set(usernames)].sort();

    const kills = players.reduce(this.presentPlayer, {});

    return {
      total_kills: this.totalKills,
      players: usernames,
      kills: kills,
    };
  }

  private presentPlayer(kills: Kills, player: Player) {
    kills[player.username()] = player.kills();
    return kills;
  }

  private reconnectPlayer(id: number, username: string) {
    let disconnected = this.disconnectedPlayers[username];
    if (!disconnected) {
      return false;
    }

    this._players[id] = disconnected;
    return true;
  }
}

export default Game;
