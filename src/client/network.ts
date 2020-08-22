import { safeEmit } from './sockets';

export function sendClientDirection(direction: number) {
  safeEmit('input', { dir: direction });
}
