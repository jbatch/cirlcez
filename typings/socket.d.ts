type JoinMessage = { username: string };
type DisconnectMessage = {};
type GameStateMessage = {
  t: number;
  serverFps: number;
  me: PlayerState;
  others: Array<PlayerState>;
  collectables: Array<CollectableState>;
};
type InputMessage = {
  dir: number;
  throttle?: number;
};
type GameOverMessage = { vendetta: { id: string; username: string } };

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
  'game-over': GameOverMessage;
};
