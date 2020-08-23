import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { joinGame } from './network';
import { processGameUpdate } from './game-state';
import { getDebugParams } from './debug';
import { initUi, showStartModal, setPlayButtonEnabled } from './ui';

const socket = initialiseSocket();

function startPlaying(name: string) {
  showStartModal(false);
  startCapturingInput();
  startRenderInterval();
  joinGame(name);
}

function stopPlaying(message: string) {
  showStartModal(true, message);
  stopCapturingInput();
  stopRenderInterval();
}

document.addEventListener('DOMContentLoaded', () => {
  initUi({ startPlaying });
  showStartModal(true, 'Circlez io');
  const debugParams = getDebugParams();
  if (debugParams.debug) {
    const name = debugParams.name + '-' + Math.floor(Math.random() * 100);
    startPlaying(name);
  }

  socket.on('connect', () => {
    setPlayButtonEnabled(true);
  });
  safeOn('disconnect', () => {
    stopPlaying('Server Disconnected!');
    setPlayButtonEnabled(false);
  });
  safeOn('game-state', (gameState) => {
    processGameUpdate(gameState);
  });
  safeOn('game-over', ({ vendetta }) => {
    stopPlaying('Game Over!');
  });
});
