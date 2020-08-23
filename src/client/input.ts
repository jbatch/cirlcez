import { getCurrentState } from './game-state';
import { sendClientInput } from './network';

function onMouseMove(e: MouseEvent) {
  handleInput(e);
}
function onTouchMove(e: TouchEvent) {
  e.preventDefault();
  handleInput(e.touches[0]);
}

type ClientInputEvent = {
  clientX: number;
  clientY: number;
};
function handleInput({ clientX, clientY }: ClientInputEvent) {
  const x = clientX;
  const y = clientY;
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;
  // The maximum distance that we care about, so that we can have the input range scale to the size of the viewport
  const maxDist = Math.min(halfWidth, halfHeight) / 2;
  const dir = Math.atan2(x - halfWidth, halfHeight - y);
  const dist = Math.sqrt(Math.pow(halfWidth - x, 2) + Math.pow(halfHeight - y, 2));
  const throttle = mapRange(0, maxDist, 0, 1, Math.min(maxDist, dist));
  sendClientInput(dir, throttle);
}

function mapRange(inStart: number, inEnd: number, outStart: number, outEnd: number, input: number) {
  return outStart + ((outEnd - inStart) / (inEnd - inStart)) * (input - inStart);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove);
}
export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('touchmove', onTouchMove);
}
