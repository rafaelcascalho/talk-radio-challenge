import Player from './Player';
import Game from './Game';
import fs from 'fs';
import * as constants from '../constants';
import { Kills, Rank, GamesObj } from '../../types';

type numOrStr = number | string;

class Parser {
  private gameIndex: number;
  private games: Array<Game>;

  constructor() {
    this.gameIndex = -1;
    this.games = [];
  }

  getGame(id: number) {
    if (this.gameIndex === -1) {
      return {
        total_kills: 0,
        players: [],
        kills: {},
      };
    }

    return this.games[id - 1].toObject();
  }

  allGames() {
    return this.games.reduce(this.presentGame, {});
  }

  rank() {
    let ranking: Rank = {};
    let rankedPlayers: Kills = this.countKills();

    let { orderedKills, rankedKills } = this.mapPlayersKills(rankedPlayers);

    let kills: number;
    let end = orderedKills.length;
    for (let index = 0; index < end; index++) {
      kills = orderedKills[index];
      ranking[`position_${index}`] = {
        username: rankedKills.get(kills),
        kills: kills,
      };
    }
    return ranking;
  }

  async readLogFile(filePath: string) {
    await fs.promises.access(filePath);

    let logLines = fs.readFileSync(filePath).toString().split('\n');
    const end = logLines.length;
    let line = '';

    for (let index = 0; index < end; index++) {
      line = logLines[index];
      const command = line.match(constants.COMMAND);
      if (!command) {
        continue;
      }

      this.processCommand(command[1], line);
    }
  }

  private processCommand(command: string, line: string) {
    switch (command) {
      case 'InitGame': {
        this.addGame();
        break;
      }
      case 'ClientUserinfoChanged': {
        this.processUserData(line);
        break;
      }
      case 'Kill': {
        this.processKill(line);
        break;
      }
      case 'ClientDisconnect': {
        this.processDisconnection(line);
        break;
      }
      default: {
        break;
      }
    }
  }

  private addGame() {
    this.gameIndex += 1;
    let game = new Game();
    this.games.push(game);
  }

  private processUserData(line: string) {
    let playerData = line.match(constants.PLAYER_INFO);
    if (!playerData) {
      console.error('ERROR! Could not get player info from the log file');
      return;
    }

    const playerId = parseInt(playerData[1]);
    const username = playerData[2].trim();

    let player = new Player(username);
    this.games[this.gameIndex].addPlayer(playerId, player);
  }

  private processKill(line: string) {
    let playersIds = line.match(constants.PLAYERS_IDS);
    if (!playersIds) {
      console.error('ERROR! Could not get who killed player in the log line');
      return;
    }

    const killerId = parseInt(playersIds[1]);
    const deadId = parseInt(playersIds[2]);

    this.games[this.gameIndex].addKill(killerId, deadId);
  }

  private processDisconnection(line: string) {
    let diconnectedId = line.match(constants.DICONNECTED_ID);
    if (!diconnectedId) {
      console.error('ERROR! Could not get player id from log file');
      return;
    }

    const playerId = parseInt(diconnectedId[1]);
    this.games[this.gameIndex].disconnectPlayer(playerId);
  }

  private presentGame(games: GamesObj, game: Game, index: number) {
    games[`game_${index + 1}`] = game.toObject();
    return games;
  }

  private countKills(): Kills {
    let games = this.games.map((game) => game.toObject());
    let rankedPlayers: Kills = {};
    let end = 0;
    let username: string;
    games.forEach((game) => {
      end = game.players.length;
      for (let index = 0; index < end; index++) {
        username = game.players[index];
        if (username in rankedPlayers) {
          rankedPlayers[username] += game.kills[username];
        } else {
          rankedPlayers[username] = game.kills[username];
        }
      }
    });
    return rankedPlayers;
  }

  private mapPlayersKills(rankedPlayers: Kills) {
    let kills = Object.values(rankedPlayers);
    let orderedKills = kills.sort(this.decreasingComparison);
    let map = new Map();
    let pairs = Object.entries(rankedPlayers);
    let rankedKills = pairs.reduce(this.createKillsMap, map);
    return { orderedKills, rankedKills };
  }

  private decreasingComparison(first: number, second: number) {
    return second - first;
  }

  private createKillsMap(
    map: Map<numOrStr, numOrStr>,
    playerInfo: Array<numOrStr>
  ) {
    let index = playerInfo[1];
    map.set(index, playerInfo[0]);
    return map;
  }
}

export default Parser;
