import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { joinGame } from './network';
import { setPlayerState, setOthersState } from './game-state';

const socket = initialiseSocket();
let playerNameEl: HTMLInputElement;
let playerNameErrorEl: HTMLDivElement;
let startGameButtonEl: HTMLButtonElement;

document.addEventListener('DOMContentLoaded', () => {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  playerNameErrorEl = document.getElementById('player-name-error') as HTMLDivElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;

  // todo: remove
  joinGame('Luke');
  startCapturingInput();
  startRenderInterval();

  socket.on('connect', () => {
    addEventHandlers();
  });
  safeOn('game-state', (gameState) => {
    const { t, me, others } = gameState;
    setPlayerState(me);
    setOthersState(others);
    console.log('OTHERS', others.length);
    console.log('ME', me.x, me.y, me);
  });
  safeOn('game-over', () => {
    console.log('Game over!');
  });
});

function onPlayButtonClick() {
  const playerName = playerNameEl.value;
  if (!playerName) {
    return alert('Player name is required');
  }
  console.log('Joining');
  joinGame(playerName);
}

function addEventHandlers() {
  startGameButtonEl.addEventListener('click', onPlayButtonClick);
}
