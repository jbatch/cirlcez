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
  }

  renderPlayerCount(others.length + 1);
  renderLeaderboard(me, others);
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
  ctx.save();
  const { x, y } = playerState;
  const vendettaId = getVendetta();
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = playerState.color;
  if (playerState.size === Constants.MAX_PLAYER_SIZE) {
    ctx.shadowColor = 'yellow';
    ctx.shadowBlur = 15;
  }
  ctx.arc(x, y, playerState.size, 0, Math.PI * 2);
  ctx.fill();

  // render player name
  ctx.fillStyle = '#ffffff';
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  const nameToRender = playerState.id === vendettaId ? `💀${playerState.username}` : playerState.username;
  ctx.fillText(nameToRender, playerState.x, playerState.y - playerState.size - 10);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function renderCollectable(collectable: CollectableState) {
  ctx.save();
  const { x, y, color, size } = collectable;
  // draw filled circle
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function setCanvasSize() {
  const { innerWidth, innerHeight } = window;
  gameCanvasEl.width = innerWidth;
  gameCanvasEl.height = innerHeight;
  renderAll();
}

function renderFpsCounter(serverFps: number, clientFps: number) {
  ctx.save();
  ctx.fillStyle = '#ff0000';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Server FPS: ' + serverFps.toFixed(0), gameCanvasEl.width * 0.95, gameCanvasEl.height * 0.05);
  ctx.fillText('Client FPS: ' + clientFps.toFixed(0), gameCanvasEl.width * 0.95, gameCanvasEl.height * 0.1);
  ctx.restore();
}

function renderPlayerCount(playerCount: number) {
  ctx.save();
  ctx.fillStyle = '#ff0000';
  ctx.font = '12px sans-serif';
  ctx.fillText('Players: ' + playerCount, 10, gameCanvasEl.height - 10);
  ctx.restore();
}

function renderLeaderboard(me: PlayerState, others: Array<PlayerState>) {
  ctx.save();
  const leadersToShow = Math.min(5, others.length + 1);
  const padding = 10;
  const fontSize = 12;
  const leaders = [me, ...others].sort((a, b) => b.size - a.size);
  const playerIndex = leaders.findIndex((leader) => leader.id === me.id);
  ctx.fillStyle = '#ff0000';
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText('Leaderboard', gameCanvasEl.width - padding, gameCanvasEl.height - leadersToShow * fontSize - padding);

  for (let index = 0; index < leadersToShow - (playerIndex < leadersToShow ? 0 : 1); index++) {
    ctx.fillText(
      `${index + 1}. ${leaders[index].username}`,
      gameCanvasEl.width - padding,
      gameCanvasEl.height - (leadersToShow - index - 1) * fontSize - padding
    );
  }
  if (playerIndex >= leadersToShow) {
    ctx.fillText(
      `${playerIndex + 1}. ${leaders[playerIndex].username}`,
      gameCanvasEl.width - padding,
      gameCanvasEl.height - (leadersToShow - 2) * fontSize - padding
    );
  }
  ctx.restore();
}

function renderMapEdge() {
  ctx.save();
  var gradient = ctx.createLinearGradient(0, 0, 1000, 0);
  gradient.addColorStop(0, 'magenta');
  gradient.addColorStop(0.5, 'blue');
  gradient.addColorStop(1.0, 'red');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#aa00aa';
  ctx.strokeRect(0, 0, Constants.MAP_SIZE, Constants.MAP_SIZE);
  ctx.restore();
}

function renderMapGrid(gridSize: number = 70, padding: number = 0) {
  ctx.save();
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
  ctx.restore();
}

export function startRenderInterval() {
  renderInterval = setInterval(renderAll, 1000 / FPS);
}

export function stopRenderInterval() {
  clearInterval(renderInterval);
}
