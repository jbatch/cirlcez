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
  const { playerState, others } = getState();
  ctx.clearRect(0, 0, gameCanvasEl.width, gameCanvasEl.height);
  ctx.strokeStyle = '#ff0000';

  ctx.fillRect(10, 10, 50, 50);
  renderPlayer(playerState);
  others.forEach((other) => renderPlayer(other));
}

function renderPlayer(playerState: PlayerState) {
  const { x, y } = playerState;
  const directionSizeRad = Math.PI / 2;
  const playerRadius = 20;
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = playerState.color;
  ctx.arc(x - playerState.size, y - playerState.size, playerState.size, 0, Math.PI * 2);
  // ctx.fillRect(x, y, 50, 50);
  ctx.fill();
  // render player name
  ctx.fillStyle = '#ffffff';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(playerState.username, playerState.x, playerState.y - playerState.size);

  // ctx.lineWidth = 4;
  // ctx.arc(x, y, 20, dir - directionSizeRad / 2, dir + directionSizeRad / 2);
  // // draw directoin stroke
  // ctx.stroke();
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
