/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
  init() {
  }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    [1, 2, 3, 4, 5].forEach((n) => {
      this.load.image(`image-1-${n}`, `assets/levels/1/1-${n}.jpg`);
    });
  }

  create() {
    this.state.start('Game');
  }
}
