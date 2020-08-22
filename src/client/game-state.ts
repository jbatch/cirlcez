import { sendClientDirection } from './network';
import { throttle } from 'throttle-debounce';

const localState = {
  dir: 0, // direction in radians
};

function _updateDirectionRad(dir: number) {
  localState.dir = dir;
}

const updateDirectionRad = throttle(40, false, _updateDirectionRad);
export { updateDirectionRad };
