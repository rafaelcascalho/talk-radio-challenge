import Game from '../../../models/Game';
import Player from '../../../models/Player';
import { WORLD_ID } from '../../../constants';

describe('Game', () => {
  describe('when the game have no players', () => {
    let game = new Game();

    test('then it returns an empty game with 0 total_kills', () => {
      const gameStatus = game.toObject();

      expect(gameStatus).toBeInstanceOf(Object);
      expect(gameStatus).toHaveProperty('players');
      expect(gameStatus['players']).toBeInstanceOf(Array);
      expect(gameStatus['players']).toHaveLength(0);
      expect(gameStatus).toHaveProperty('kills');
      expect(gameStatus['kills']).toBeInstanceOf(Object);
      expect(gameStatus['kills']).toMatchObject({});
    });
  });

  describe('when the game have players', () => {
    let game = new Game();
    const playerOne = new Player('player1');
    const playerTwo = new Player('player2');
    const expectedKills = { player1: 0, player2: 0 };
    const expectedPlayers = ['player1', 'player2'];

    test('then it returns players data in the game', () => {
      game.addPlayer(1, playerOne);
      game.addPlayer(2, playerTwo);
      const gameStatus = game.toObject();

      expect(gameStatus['players']).toMatchObject(expectedPlayers);
      expect(gameStatus['kills']).toMatchObject(expectedKills);
    });
  });

  describe('when players kill each other and die to the world', () => {
    let game = new Game();
    const playerOne = new Player('player1');
    const playerTwo = new Player('player2');
    const expectedKills = { player1: 0, player2: 2 };
    const expectedPlayers = ['player1', 'player2'];
    game
      .addPlayer(1, playerOne)
      .addKill(1, 2)
      .addPlayer(2, playerTwo)
      .addKill(2, 1)
      .addKill(2, 1)
      .addKill(WORLD_ID, 1);

    test('then it returns players data and their kills', () => {
      const gameStatus = game.toObject();

      expect(gameStatus['players']).toMatchObject(expectedPlayers);
      expect(gameStatus['kills']).toMatchObject(expectedKills);
    });
  });

  describe('when a player diconnect from the game', () => {
    let game = new Game();
    const playerOne = new Player('player1');
    const playerTwo = new Player('player2');
    const expectedKills = { player1: 1, player2: 1 };
    const expectedPlayers = ['player1', 'player2'];
    game
      .addPlayer(1, playerOne)
      .addKill(1, 2)
      .addPlayer(2, playerTwo)
      .addKill(2, 1)
      .addKill(2, 1)
      .disconnectPlayer(1)
      .addKill(WORLD_ID, 2);

    test('then it returns that player data and kills', () => {
      const gameStatus = game.toObject();

      expect(gameStatus['players']).toMatchObject(expectedPlayers);
      expect(gameStatus['kills']).toMatchObject(expectedKills);
    });
  });
});
