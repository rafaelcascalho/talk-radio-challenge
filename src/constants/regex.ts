export const COMMAND = /^.{0,7}([a-z A-Z][^:]*)/;

export const DICONNECTED_ID = /ClientDisconnect: ([0-9]*)/;
export const PLAYER_INFO = /ClientUserinfoChanged: ([0-9]*) n\\(.*)\\t\\[0-9]+\\model/;
export const PLAYERS_IDS = /Kill: ([0-9]+) ([0-9]+)/;
