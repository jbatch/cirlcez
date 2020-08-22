import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';

const socket = initialiseSocket();
let playerNameEl: HTMLInputElement;
let playerNameErrorEl: HTMLDivElement;
let startGameButtonEl: HTMLButtonElement;

document.addEventListener('DOMContentLoaded', () => {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  playerNameErrorEl = document.getElementById('player-name-error') as HTMLDivElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;

  // todo: remove
  safeEmit('join', { username: 'Luke' });
  startCapturingInput();

  socket.on('connect', () => {
    addEventHandlers();
  });
  safeOn('game-state', (gameState) => {
    const { t, me } = gameState;
    console.log(t, me);
  });
});

function onPlayButtonClick() {
  const playerName = playerNameEl.value;
  if (!playerName) {
    return alert('Player name is required');
  }
  console.log('Joining');
  safeEmit('join', { username: playerName });
}

function addEventHandlers() {
  startGameButtonEl.addEventListener('click', onPlayButtonClick);
}
