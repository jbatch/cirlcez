import { getCurrentState } from './game-state';
import { sendClientDirection } from './network';

function onMouseMove(e: MouseEvent) {
  handleInput(e);
}
function onTouchMove(e: TouchEvent) {
  e.preventDefault();
  handleInput(e.touches[0]);
}

function handleInput({ clientX, clientY }: { clientX: number; clientY: number }) {
  const currentState = getCurrentState();
  if (!currentState) return;
  const { me } = currentState;
  const dir = Math.atan2(clientX - window.innerWidth / 2, window.innerHeight / 2 - clientY);
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
