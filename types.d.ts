export interface Kills {
  [key: string]: number;
}

export interface Rank {
  [key: string]: object;
}

export interface GamesObj {
  [key: string]: object;
}

export interface Players {
  [key: number]: Player;
}

export interface Disconnected {
  [key: string]: Player;
}
