import Parser from '../models/Parser';
import * as express from 'express';

class GameController {
  private parser: Parser;

  constructor(parser: Parser, logPath: string) {
    this.parser = parser;
    this.parser.readLogFile(logPath);
  }

  index = (request: express.Request, response: express.Response) => {
    return response.status(200).json({
      status: 'success',
      games: this.parser.allGames(),
    });
  };

  show = (request: express.Request, response: express.Response) => {
    let id: number = parseInt(request.params.id);
    const gameNotFound = id < 1 || id > 21;
    if (gameNotFound) {
      return response.status(404).json({
        status: 'error',
        message: `game of id ${id} not found`,
      });
    }

    return response.status(200).json({
      status: 'success',
      games: this.parser.getGame(id),
    });
  };

  rank = (request: express.Request, response: express.Response) => {
    return response.status(200).json({
      status: 'success',
      ranking: this.parser.rank(),
    });
  };
}

export default GameController;
