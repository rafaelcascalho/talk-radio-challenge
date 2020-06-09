import Parser from '../../../models/Parser';
import path from 'path';
import expectedranking from '../../fixtues/ranking.json';

describe('Parser', () => {
  describe('when the log file does not exist', () => {
    let parser = new Parser();

    test('then it throws an error', async () => {
      const logPath = 'fake/path';

      try {
        await parser.readLogFile(logPath);
      } catch (error) {
        expect(error.code).toEqual('ENOENT');
      }
    });
  });

  describe('when the log file exists but it is empty', () => {
    let parser = new Parser();

    beforeAll(async () => {
      const logPath = path.join(__dirname, '../../fixtues/empty.log');
      await parser.readLogFile(logPath);
    });

    test('then it have no games', () => {
      const games = parser.allGames();

      expect(games).toMatchObject({});
    });

    test('then it have an empty rank', () => {
      const ranking = parser.rank();

      expect(ranking).toMatchObject({});
    });
  });

  describe('given the log file exists and has game logs', () => {
    let parser = new Parser();

    beforeAll(async () => {
      const logPath = path.join(__dirname, '../../fixtues/game.log');
      await parser.readLogFile(logPath);
    });

    test('then it have games', () => {
      const games = parser.allGames();

      expect(games).toBeInstanceOf(Object);
      expect(Object.keys(games).length).toEqual(21);
    });

    test('then it allows access to specific game data', () => {
      const game = parser.getGame(0);

      expect(game).toBeInstanceOf(Object);
      expect(game).toHaveProperty('total_kills');
      expect(game['total_kills']).toBeGreaterThanOrEqual(0);
      expect(game).toHaveProperty('players');
      expect(game['players']).toBeInstanceOf(Array);
      expect(game['players'].length).toBeGreaterThanOrEqual(0);
      expect(game).toHaveProperty('kills');
      expect(game['kills']).toBeInstanceOf(Object);
    });

    test('then it has ranked players', () => {
      const ranking = parser.rank();

      expect(ranking).toMatchObject(expectedranking);
    });
  });
});
