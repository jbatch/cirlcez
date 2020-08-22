type JoinMessage = {username: string};
type DisconnectMessage = {}

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
}