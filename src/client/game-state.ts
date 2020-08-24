const RENDER_DELAY_MS = 100;

// Keep a list of the most recent game updates so that we can interpolate between them
const gameUpdates: Array<GameStateMessage> = [];
let gameStartTime: number = 0;
let firstServerTime: number = 0;

export function processGameUpdate(update: GameStateMessage) {
  if (!firstServerTime) {
    firstServerTime = update.t;
    gameStartTime = Date.now();
  }
  gameUpdates.push(update);

  // Keep only one game update before the current server time
  const baseUpdateIdx = getBaseUpdateIdx();
  if (baseUpdateIdx > 0) {
    gameUpdates.splice(0, baseUpdateIdx);
  }
}

function currentServerTime() {
  return firstServerTime + (Date.now() - gameStartTime) - RENDER_DELAY_MS;
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.UpdateIdx
function getBaseUpdateIdx() {
  const serverTime = currentServerTime();
  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].t <= serverTime) {
      return i;
    }
  }
  return -1;
}

export function getCurrentState(): GameStateMessage {
  if (!firstServerTime) {
    return null;
  }

  const baseUpdateIdx = getBaseUpdateIdx();
  const serverTime = currentServerTime();

  // If base is the most recent update we have, use its state.
  // Otherwise, interpolate between its state and the state of (base + 1).
  if (baseUpdateIdx < 0 || baseUpdateIdx === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1];
  } else {
    const baseUpdate = gameUpdates[baseUpdateIdx];
    const next = gameUpdates[baseUpdateIdx + 1];
    // how much to interpolate
    const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);

    return {
      t: baseUpdate.t,
      me: interpolateObject(baseUpdate.me, next.me, ratio),
      others: interpolateObjectArray(baseUpdate.others, next.others, ratio),
      collectables: interpolateObjectArray(baseUpdate.collectables, next.collectables, ratio),
      serverFps: baseUpdate.serverFps,
    };
  }
}

function interpolateObject(object1: any, object2: any, ratio: number) {
  if (!object2) {
    return object1;
  }

  const interpolated: any = {};
  Object.keys(object1).forEach((key) => {
    if (key === 'direction') {
      interpolated[key] = interpolateDirection(object1[key], object2[key], ratio);
    }
    if (key === 'username') {
      interpolated[key] = object1[key];
    } else if (!isNaN(object1[key])) {
      interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
    } else {
      interpolated[key] = object1[key];
    }
  });
  return interpolated;
}

function interpolateObjectArray(objects1: any, objects2: any, ratio: number) {
  return objects1.map((obj: any) =>
    interpolateObject(
      obj,
      objects2.find((obj2: any) => obj.id === obj2.id),
      ratio
    )
  );
}

// Determines the best way to rotate (cw or ccw) when interpolating a direction.
// For example, when rotating from -3 radians to +3 radians, we should really rotate from
// -3 radians to +3 - 2pi radians.
function interpolateDirection(d1: number, d2: number, ratio: number) {
  const absD = Math.abs(d2 - d1);
  if (absD >= Math.PI) {
    // The angle between the directions is large - we should rotate the other way
    if (d1 > d2) {
      return d1 + (d2 + 2 * Math.PI - d1) * ratio;
    } else {
      return d1 - (d2 - 2 * Math.PI - d1) * ratio;
    }
  } else {
    // Normal interp
    return d1 + (d2 - d1) * ratio;
  }
}
