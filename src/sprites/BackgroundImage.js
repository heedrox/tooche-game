import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({
    game, asset,
  }) {
    super(game, game.world.centerX, game.world.centerY, asset);
    this.anchor.setTo(0.5);
  }
}
