import { getPreviousName, setPreviousName } from './local-storage';

let playerNameEl: HTMLInputElement;
let startGameButtonEl: HTMLButtonElement;
let modalTitleEl: HTMLDivElement;
let startGameModal: HTMLDivElement;
let modalSecondaryEl: HTMLDivElement;

type InitUiProps = {
  startPlaying: (name: string) => void;
};

export function initUi(initUiProps: InitUiProps) {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;
  modalTitleEl = document.getElementById('modal-title') as HTMLDivElement;
  startGameModal = document.getElementById('start-game-modal') as HTMLDivElement;
  modalSecondaryEl = document.getElementById('modal-secondary-text') as HTMLDivElement;

  addEventListeners(initUiProps);
}

function addEventListeners(initUiProps: InitUiProps) {
  startGameButtonEl.addEventListener('click', () => {
    const playerName = playerNameEl.value || 'Anon';
    setPreviousName(playerName);
    showModal(false);
    setPlayButtonEnabled(false);
    initUiProps.startPlaying(playerName);
  });
}

export function showModal(show: boolean, str?: string, str2?: string) {
  if (show) {
    modalTitleEl.innerText = str || 'Circlez io';
    modalSecondaryEl.innerText = str2 || 'Yet another Agar.io clone!';
    playerNameEl.value = getPreviousName();
    startGameModal.classList.remove('hidden');
  } else {
    startGameModal.classList.add('hidden');
  }
}

export function setPlayButtonEnabled(enabled: boolean) {
  startGameButtonEl.disabled = !enabled;
}
