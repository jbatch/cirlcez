import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { joinGame } from './network';
import { processGameUpdate } from './game-state';
import { getDebugParams } from './debug';
import { initUi, showStartModal } from './ui';

const socket = initialiseSocket();

document.addEventListener('DOMContentLoaded', () => {
  initUi();
  const debugParams = getDebugParams();
  if (debugParams.debug) {
    const name = debugParams.name + '-' + Math.floor(Math.random() * 100);
    startPlaying(name);
  }

  socket.on('connect', () => {});
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {
    const { t, me, others } = gameState;

    processGameUpdate(gameState);
  });
  safeOn('game-over', () => {
    showStartModal(true, 'Game Over!');
    stopCapturingInput();
    stopRenderInterval();
  });
});

function startPlaying(name: string) {
  showStartModal(false);
  startCapturingInput();
  startRenderInterval();
  joinGame(name);
}
