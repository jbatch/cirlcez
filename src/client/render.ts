import { debounce } from 'throttle-debounce';
import { getCurrentState } from './game-state';
import { getDebugParams } from './debug';

const FPS = 60;
let gameCanvasEl: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderInterval: ReturnType<typeof setInterval>;
let lastRenderTime: number;

const debugParams = getDebugParams();

document.addEventListener('DOMContentLoaded', () => {
  gameCanvasEl = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = gameCanvasEl.getContext('2d');
  setCanvasSize();
  startRenderInterval();
  lastRenderTime = Date.now();
});

window.addEventListener('resize', debounce(40, setCanvasSize));

function renderAll() {
  const { me, others, serverFps } = getCurrentState();
  ctx.clearRect(0, 0, gameCanvasEl.width, gameCanvasEl.height);
  ctx.strokeStyle = '#ff0000';

  renderPlayer(me);
  others.forEach((other: PlayerState) => renderPlayer(other));
  if (debugParams.debug) {
    // Render FPS counter
    const clientFps = 1 / ((Date.now() - lastRenderTime) / 1000);
    renderFpsCounter(serverFps, clientFps);
  }
  lastRenderTime = Date.now();
}

function renderPlayer(playerState: PlayerState) {
  const { x, y } = playerState;
  const directionSizeRad = Math.PI / 2;
  const playerRadius = 20;
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = playerState.color;
  ctx.arc(x, y, playerState.size, 0, Math.PI * 2);
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

function renderFpsCounter(serverFps: number, clientFps: number) {
  ctx.fillStyle = '#ff0000';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Server FPS: ' + serverFps.toFixed(0), gameCanvasEl.width * 0.95, gameCanvasEl.height * 0.05);
  ctx.fillText('Client FPS: ' + clientFps.toFixed(0), gameCanvasEl.width * 0.95, gameCanvasEl.height * 0.1);
}

export function startRenderInterval() {
  renderInterval = setInterval(renderAll, 1000 / FPS);
}

export function stopRenderInterval() {
  clearInterval(renderInterval);
}
