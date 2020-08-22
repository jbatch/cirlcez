import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { joinGame } from './network';
import { processGameUpdate } from './game-state';
import { getDebugParams } from './debug';

const socket = initialiseSocket();
let playerNameEl: HTMLInputElement;
let playerNameErrorEl: HTMLDivElement;
let startGameButtonEl: HTMLButtonElement;
let modalTitleEl: HTMLDivElement;
let startGameModal: HTMLDivElement;

document.addEventListener('DOMContentLoaded', () => {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  playerNameErrorEl = document.getElementById('player-name-error') as HTMLDivElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;
  modalTitleEl = document.getElementById('modal-title') as HTMLDivElement;
  startGameModal = document.getElementById('start-game-modal') as HTMLDivElement;

  const debugParams = getDebugParams();
  if (debugParams.debug) {
    const name = debugParams.name || 'Agar.io';
    startGameModal.classList.add('hidden');
    joinGame(name + '-' + Math.floor(Math.random() * 100));
  }

  // todo: remove
  startCapturingInput();
  startRenderInterval();

  socket.on('connect', () => {
    addEventHandlers();
  });
  safeOn('game-state', (gameState) => {
    const { t, me, others } = gameState;
    processGameUpdate(gameState);
  });
  safeOn('game-over', () => {
    modalTitleEl.innerText = 'Game Over!';
    startGameModal.classList.remove('hidden');
  });
});

function onPlayButtonClick() {
  const playerName = playerNameEl.value;
  if (!playerName) {
    return alert('Player name is required');
  }
  startGameModal.classList.add('hidden');
  joinGame(playerName);
}

function addEventHandlers() {
  startGameButtonEl.addEventListener('click', onPlayButtonClick);
}
