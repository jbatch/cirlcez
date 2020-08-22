type JoinMessage = { username: string };
type DisconnectMessage = {};
type GameStateMessage = {
  t: number;
  serverFps: number;
  me: PlayerState;
  others: Array<PlayerState>;
};
type InputMessage = {
  dir: number;
  throttle?: number;
};
type GameOverMessage = {};

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
  'game-over': GameOverMessage;
};
