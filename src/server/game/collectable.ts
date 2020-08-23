import Entity from './entity';
import Constants from '../../shared/constants';

export default class Collectable extends Entity {
  alive: boolean;
  size: number;
  color: string;
  constructor(id: string, x: number, y: number, size: number, color: string) {
    super(id, x, y, 0, 0);
    this.alive = true;
    this.size = size;
    this.color = color;
  }

  update(dt: number) {}

  setAlive(alive: boolean) {
    this.alive = alive;
  }

  serializeForUpdate(): CollectableState {
    return {
      ...super.serializeForUpdate(),
      size: this.size,
      color: this.color,
    };
  }
}
