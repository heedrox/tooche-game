/* eslint-disable class-methods-use-this,no-lonely-if,prefer-destructuring,no-plusplus */
/* globals __DEV__ */
import Phaser from 'phaser';
import BackgroundImage from '../sprites/BackgroundImage';

export default class extends Phaser.State {
  init() {
  }

  create() {
    this.backgroundImage = new BackgroundImage({
      game: this.game,
      asset: 'image-1-1',
    });

    this.game.add.existing(this.backgroundImage);
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.backgroundImage);
    }
  }

  update() {
    // console.log('positions', this.getWorldPointFromPixelPoint(this.mousePosWorld));
    this.game.camera.setPosition(this.mousePosWorld.x, this.mousePosWorld.y);
    // this.game.camera.scale = this.game.camera.scale + 0.1;
    // console.log('update', fps);
    // this.game.world.Step(1 / fps, 8, 3);
    // this.game.world.ClearForces();

    // if ( imagesLoaded ) {
    //   positionImages();
    // }
  }
}
