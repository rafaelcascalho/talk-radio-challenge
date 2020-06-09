import Player from '../../../models/Player';

describe('Player', () => {
  describe('when a new player is created', () => {
    test('then it has no kills', () => {
      const player = new Player('username');

      const username = player.username();
      const kills = player.kills();
      const playerObj = player.toObject();

      expect(player).toBeInstanceOf(Player);
      expect(username).toEqual('username');
      expect(playerObj.username).toEqual('username');
      expect(kills).toEqual(0);
      expect(playerObj.kills).toEqual(0);
    });
  });

  describe("when the player update it's user name", () => {
    test("then it's username is changed", () => {
      const player = new Player('username');

      player.updateUsername('new username');
      const username = player.username();

      expect(username).toEqual('new username');
    });
  });

  describe('when the player killed nobody', () => {
    test('then it has no kills', () => {
      const player = new Player('username');

      const kills = player.kills();

      expect(kills).toEqual(0);
    });
  });

  describe('when the player killed nobody and died to the world', () => {
    const player = new Player('username').diedToTheWorld();

    const kills = player.kills();

    expect(kills).toEqual(0);
  });

  describe('when the player killed and did not die to the world', () => {
    const player = new Player('username').addKill();

    const kills = player.kills();

    expect(kills).toEqual(1);
  });

  describe('when the player killed and died to the world', () => {
    test('then it has not kills', () => {
      const player = new Player('username').addKill().diedToTheWorld();

      const kills = player.kills();

      expect(kills).toEqual(0);
    });
  });
});
