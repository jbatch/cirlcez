import { safeEmit } from './sockets';

export function sendClientDirection(direction: number) {
  safeEmit('input', { dir: direction });
}

export function joinGame(playerName: string) {
  safeEmit('join', { username: playerName });
}
