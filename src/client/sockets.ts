import socketIO from 'socket.io-client';

// our single instance of socket that everyone will use
let socket: SocketIOClient.Socket;

function getSocket() {
  if (!socket) {
    throw Error('Attempted to load socket before it was initialised');
  }
  return socket;
}

function initialiseSocket() {
  const useSecureConnection = process.env.NODE_ENV ? Boolean(process.env.NODE_ENV === 'production') : false;
  console.log('Secure?', process.env.NODE_ENV, useSecureConnection);
  socket = socketIO.connect(`ws://${window.location.host}`, { secure: useSecureConnection });
  socket.on('connect', () => {
    console.log('Connected to server~');
  });

  return socket;
}

function safeEmit<Event extends keyof SocketEvents>(event: Event, payload?: SocketEvents[Event]) {
  getSocket().emit(event, payload);
}
function safeOn<Event extends keyof SocketEvents>(event: Event, callback: (payload?: SocketEvents[Event]) => void) {
  getSocket().on(event, callback);
}
function safeOff<Event extends keyof SocketEvents>(event: Event) {
  getSocket().off(event);
}

export { initialiseSocket, getSocket, safeEmit, safeOn, safeOff };
