import { debounce } from 'throttle-debounce';
import { getCurrentState } from './game-state';
import { getDebugParams } from './debug';
import Constants from '../shared/constants';
import { getVendetta } from './local-storage';

const FPS = 60;
let gameCanvasEl: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderInterval: ReturnType<typeof setInterval>;
let lastRenderTime: number;
let lastClientFps: number;
let framesTilNextFpsCheck: number;

const debugParams = getDebugParams();

document.addEventListener('DOMContentLoaded', () => {
  gameCanvasEl = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = gameCanvasEl.getContext('2d');
  setCanvasSize();
  lastClientFps = 0;
  framesTilNextFpsCheck = 10;
});

window.addEventListener('resize', debounce(40, setCanvasSize));

function renderAll() {
  const gameState = getCurrentState();
  if (!gameState) return;
  const { me, others, collectables, serverFps } = gameState;

  ctx.clearRect(0, 0, gameCanvasEl.width, gameCanvasEl.height);

  if (debugParams.debug) {
    // Render FPS counter
    if (framesTilNextFpsCheck <= 0) {
      lastClientFps = 1 / ((performance.now() - lastRenderTime) / 1000);
      framesTilNextFpsCheck = 10;
    }
    renderFpsCounter(serverFps, lastClientFps);
    renderPlayerCount(others.length + 1);
  }

  lastRenderTime = performance.now();
  ctx.strokeStyle = '#ff0000';
  ctx.save();
  ctx.translate(gameCanvasEl.width / 2 - me.x, gameCanvasEl.height / 2 - me.y);

  renderMapGrid();
  renderPlayer(me);
  others.forEach(renderPlayer);
  collectables.forEach(renderCollectable);
  renderMapEdge();
  ctx.restore();
  framesTilNextFpsCheck--;
}

function renderPlayer(playerState: PlayerState) {
  const { x, y } = playerState;
  const vendettaId = getVendetta();
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = playerState.color;
  ctx.arc(x, y, playerState.size, 0, Math.PI * 2);
  ctx.fill();

  // render player name
  ctx.fillStyle = '#ffffff';
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  const nameToRender = playerState.id === vendettaId ? `💀${playerState.username}` : playerState.username;
  ctx.fillText(nameToRender, playerState.x, playerState.y - playerState.size - 10);

  // ctx.lineWidth = 4;
  // ctx.arc(x, y, 20, dir - directionSizeRad / 2, dir + directionSizeRad / 2);
  // // draw directoin stroke
  // ctx.stroke();
}

function renderCollectable(collectable: CollectableState) {
  const { x, y, color, size } = collectable;
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
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

function renderPlayerCount(playerCount: number) {
  ctx.fillStyle = '#ff0000';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Players: ' + playerCount, gameCanvasEl.width * 0.95, gameCanvasEl.height * 0.15);
}

function renderMapEdge() {
  var gradient = ctx.createLinearGradient(0, 0, 1000, 0);
  gradient.addColorStop(0, 'magenta');
  gradient.addColorStop(0.5, 'blue');
  gradient.addColorStop(1.0, 'red');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#aa00aa';
  ctx.strokeRect(0, 0, Constants.MAP_SIZE, Constants.MAP_SIZE);
}

function renderMapGrid(gridSize: number = 70, padding: number = 0) {
  for (var x = 0; x <= Constants.MAP_SIZE; x += gridSize) {
    ctx.moveTo(0.5 + x + padding, padding);
    ctx.lineTo(0.5 + x + padding, Constants.MAP_SIZE + padding);
  }

  for (var x = 0; x <= Constants.MAP_SIZE; x += gridSize) {
    ctx.moveTo(padding, 0.5 + x + padding);
    ctx.lineTo(Constants.MAP_SIZE + padding, 0.5 + x + padding);
  }
  ctx.strokeStyle = '#9e9e9e';
  ctx.stroke();
}

export function startRenderInterval() {
  renderInterval = setInterval(renderAll, 1000 / FPS);
}

export function stopRenderInterval() {
  clearInterval(renderInterval);
}
