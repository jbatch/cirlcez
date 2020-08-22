import { updateDirectionRad } from './game-state';
import { sendClientDirection } from './network';

function onMouseMove(e: MouseEvent) {
  handleInput(e);
}
function onTouchMove(e: TouchEvent) {
  handleInput(e.touches[0]);
}

function handleInput({ clientX, clientY }: { clientX: number; clientY: number }) {
  const dir = Math.atan2(clientX - window.innerWidth / 2, window.innerHeight / 2 - clientY);
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
