import Player from './Player';
import Game from './Game';
import fs from 'fs';
import * as constants from '../constants';
import { Rank, GamesObj } from '../../types';

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

    return this.games[id].toObject();
  }

  allGames() {
    return this.games.reduce(this.presentGame, {});
  }

  rank() {
    return {};
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
    //this.finishLastGame();

    this.startNewGame();
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

  private startNewGame() {
    this.gameIndex += 1;
    let game = new Game();
    this.games.push(game);
  }

  private presentGame(games: GamesObj, game: Game, index: number) {
    games[`game_${index + 1}`] = game.toObject();
    return games;
  }
}

export default Parser;
