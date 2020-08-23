export default Object.freeze({
  MAP_SIZE: Number(process.env.MAP_SIZE) || 1000,
  MAX_PLAYER_SIZE: Number(process.env.MAX_PLAYER_SIZE) || 100,
  COLLISION_THRESHOLD: Number(process.env.COLLISION_THRESHOLD) || 10,
});
