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
  socket = socketIO.connect(`ws://${window.location.host}`);
  socket.on('connect', () => {
    console.log('Connected to server');
    socket.on('game-state', (state: any) => console.log('Got game state', JSON.stringify(state)));
  });

  return socket;
}
/*function initialiseSocket() {
  return new Promise((resolve, reject) => {
    try {
      socket = socketIO.connect(`ws://${window.location.host}`);
      socket.on('connect', () => {
        console.log('Connected to server');
        resolve(socket);
      });
    } catch (err) {
      reject(err);
    }
  })
} */

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
