import { safeEmit } from './sockets';

export function sendClientInput(direction: number, throttle: number) {
  safeEmit('input', { dir: direction, throttle: throttle });
}

export function joinGame(playerName: string) {
  safeEmit('join', { username: playerName });
}
