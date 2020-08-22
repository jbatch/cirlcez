import { getCurrentState } from './game-state';
import { sendClientDirection } from './network';

function onMouseMove(e: MouseEvent) {
  handleInput(e);
}
function onTouchMove(e: TouchEvent) {
  handleInput(e.touches[0]);
}

function handleInput({ clientX, clientY }: { clientX: number; clientY: number }) {
  const { me } = getCurrentState();
  const dir = Math.atan2(clientX - me.x, me.y - clientY);
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
