/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import { centerGameObjects } from '../utils';
import LEVELS from '../levels';

const getImage = (isGuiado, level) => {
  if (isGuiado) return `assets/levels/${level.world}/guiado/${level.level}.jpg`;
  return `assets/levels/${level.world}/guia/base.jpg`;
};

export default class extends Phaser.State {
  constructor(isGuiado) {
    super();
    this.isGuiado = isGuiado;
  }

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
    LEVELS.forEach((level) => {
      this.load.image(`image-${level.world}-${level.level}`, getImage(this.isGuiado, level));
    });
    this.load.spritesheet('target', 'assets/anim-sprites/target.png', 256, 256, 8);
    this.load.audio('ko', 'assets/audio/ko.ogg');
    this.load.audio('ok', 'assets/audio/ok.ogg');
  }

  create() {
    this.state.start('Game');
  }
}
