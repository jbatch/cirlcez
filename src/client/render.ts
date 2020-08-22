import { debounce } from 'throttle-debounce';
import { getState } from './game-state';

const FPS = 60;
let gameCanvasEl: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderInterval: ReturnType<typeof setInterval>;

document.addEventListener('DOMContentLoaded', () => {
  gameCanvasEl = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = gameCanvasEl.getContext('2d');
  setCanvasSize();
  startRenderInterval();
});

window.addEventListener('resize', debounce(40, setCanvasSize));

function renderAll() {
  const { playerState } = getState();
  ctx.clearRect(0, 0, gameCanvasEl.width, gameCanvasEl.height);
  ctx.strokeStyle = '#ff0000';

  ctx.fillRect(10, 10, 50, 50);
  renderPlayer(playerState);
}

function renderPlayer(playerState: PlayerState) {
  const { x, y } = playerState;
  // ctx.arc(x, y, 20, 0, Math.PI);
  ctx.fillRect(x, y, 50, 50);
}

function setCanvasSize() {
  const { innerWidth, innerHeight } = window;
  gameCanvasEl.width = innerWidth;
  gameCanvasEl.height = innerHeight;
  renderAll();
}

export function startRenderInterval() {
  renderInterval = setInterval(renderAll, 1000 / FPS);
}

export function stopRenderInterval() {
  clearInterval(renderInterval);
}
