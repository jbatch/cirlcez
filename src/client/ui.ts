import { joinGame } from './network';

let playerNameEl: HTMLInputElement;
let playerNameErrorEl: HTMLDivElement;
let startGameButtonEl: HTMLButtonElement;
let modalTitleEl: HTMLDivElement;
let startGameModal: HTMLDivElement;

export function initUi() {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  playerNameErrorEl = document.getElementById('player-name-error') as HTMLDivElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;
  modalTitleEl = document.getElementById('modal-title') as HTMLDivElement;
  startGameModal = document.getElementById('start-game-modal') as HTMLDivElement;

  startGameButtonEl.addEventListener('click', onPlayButtonClick);
}

function onPlayButtonClick() {
  const playerName = playerNameEl.value;
  if (!playerName) {
    return alert('Player name is required');
  }
  startGameModal.classList.add('hidden');
  joinGame(playerName);
}

export function showStartModal(show: boolean, str?: string) {
  if (show) {
    modalTitleEl.innerText = str || '';
    startGameModal.classList.remove('hidden');
  } else {
    startGameModal.classList.add('hidden');
  }
}

function setNameError(error: boolean, str?: string) {}
