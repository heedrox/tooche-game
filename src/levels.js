const aLevel = (world, level, centerX, centerY, size) =>
  ({ world, level, centerX, centerY, size });

const LEVELS = [
  aLevel(1, 1, 325, 350, 175),
  aLevel(1, 2, 260, 250, 175),
];

export default LEVELS;
