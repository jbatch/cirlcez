import { updateDirectionRad, getState } from './game-state';
import { sendClientDirection } from './network';

function onMouseMove(e: MouseEvent) {
  handleInput(e);
}
function onTouchMove(e: TouchEvent) {
  handleInput(e.touches[0]);
}

function handleInput({ clientX, clientY }: { clientX: number; clientY: number }) {
  const { playerState } = getState();
  const dir = Math.atan2(clientX - playerState.x, playerState.y - clientY);
  updateDirectionRad(dir);
  sendClientDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove);
}
export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('touchmove', onTouchMove);
}
