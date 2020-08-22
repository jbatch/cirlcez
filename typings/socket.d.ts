type JoinMessage = {username: string};
type DisconnectMessage = {}
type GameStateMessage = {
  t: number,
  me: PlayerState;
}
type InputMessage = {
  dir: number;
}

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
}