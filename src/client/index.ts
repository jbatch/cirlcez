import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { startRenderInterval, stopRenderInterval } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { joinGame } from './network';
import { processGameUpdate } from './game-state';
import { getDebugParams } from './debug';
import { initUi, showStartModal } from './ui';

const socket = initialiseSocket();

function startPlaying(name: string) {
  showStartModal(false);
  startCapturingInput();
  startRenderInterval();
  joinGame(name);
}

document.addEventListener('DOMContentLoaded', () => {
  initUi({ startPlaying });
  const debugParams = getDebugParams();
  if (debugParams.debug) {
    const name = debugParams.name + '-' + Math.floor(Math.random() * 100);
    startPlaying(name);
  }

  socket.on('connect', () => {});
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {
    processGameUpdate(gameState);
  });
  safeOn('game-over', ({ vendetta }) => {
    console.log(vendetta);
    showStartModal(true, 'Game Over!');
    stopCapturingInput();
    stopRenderInterval();
  });
});
