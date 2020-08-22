import { sendClientDirection } from './network';
import { throttle } from 'throttle-debounce';
import Player from '../server/game/player';

type GameState = {
  dir: number;
  playerState: PlayerState;
  others: Array<PlayerState>;
  t: number;
};
const state: GameState = {
  dir: 0, // direction in radians
  playerState: {
    x: 0,
    y: 0,
    id: '',
    username: '',
    color: '',
  },
  others: [],
  t: 0,
};

function _updateDirectionRad(dir: number) {
  state.dir = dir;
}

export function getState() {
  return state;
}

export function setPlayerState(playerState: PlayerState) {
  console.log('a', playerState.y);
  state.playerState = playerState;
  console.log('b', playerState.y);
}

const updateDirectionRad = throttle(40, false, _updateDirectionRad);
export { updateDirectionRad };
