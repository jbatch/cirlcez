let playerNameEl: HTMLInputElement;
let startGameButtonEl: HTMLButtonElement;
let modalTitleEl: HTMLDivElement;
let startGameModal: HTMLDivElement;

type InitUiProps = {
  startPlaying: (name: string) => void;
};

export function initUi(initUiProps: InitUiProps) {
  playerNameEl = document.getElementById('player-name') as HTMLInputElement;
  startGameButtonEl = document.getElementById('play-button') as HTMLButtonElement;
  modalTitleEl = document.getElementById('modal-title') as HTMLDivElement;
  startGameModal = document.getElementById('start-game-modal') as HTMLDivElement;

  addEventListeners(initUiProps);
}

function addEventListeners(initUiProps: InitUiProps) {
  startGameButtonEl.addEventListener('click', () => {
    const playerName = playerNameEl.value || 'Anon';
    storeLastName(playerName);
    showStartModal(false);
    initUiProps.startPlaying(playerName);
  });
}

export function showStartModal(show: boolean, str?: string) {
  if (show) {
    modalTitleEl.innerText = str || '';
    playerNameEl.value = getLastName();
    startGameModal.classList.remove('hidden');
  } else {
    startGameModal.classList.add('hidden');
  }
}

function storeLastName(name: string) {
  localStorage.setItem('lastName', name);
}

function getLastName() {
  return localStorage.getItem('lastName') || '';
}
