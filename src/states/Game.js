/* eslint-disable class-methods-use-this,no-lonely-if,prefer-destructuring,no-plusplus */
/* globals __DEV__ */
import Phaser from 'phaser';
import BackgroundImage from '../sprites/BackgroundImage';
import LEVELS from '../levels';

const isLandscape = image => image.texture.width > image.texture.height;
const getRatio = (image, game) => {
  if ((isLandscape(image) && game.scale.isGameLandscape) ||
    (!isLandscape(image) && game.scale.isGamePortrait)) {
    return game.height / image.texture.height;
  }
  return game.width / image.texture.width;
};
export default class extends Phaser.State {
  constructor(isGuiado) {
    super();
    this.isGuiado = isGuiado;
  }
  init() {
    this.backgroundImage = null;
    this.currentLevel = LEVELS[0];
  }

  create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.parentIsWindow = true;
    this.addBackgroundImage(this.currentLevel);
    if (!this.isGuiado) {
      this.addTarget(this.currentLevel);
    }
    if (this.isGuiado) {
      this.backgroundImage.inputEnabled = true;
      this.backgroundImage.events.onInputDown.add(this.guiadoClick.bind(this), this);
    }
    this.positionElements();
    this.game.scale.onOrientationChange.add((x) => {
      setTimeout(() => {
        console.log('orientation change', x);
        this.resizeGame();
        this.positionElements();
      }, 1000);
    });
  }

  addBackgroundImage(level) {
    this.backgroundImage = new BackgroundImage({
      game: this.game,
      asset: `image-${level.world}-${level.level}`,
    });

    this.game.add.existing(this.backgroundImage);
  }

  addTarget(level) {
    const size = level.size;
    this.targetImage = this.game.add.sprite(-size / 2, -size / 2, 'target');
    this.targetImage.animations.add('showTarget');
    this.targetImage.animations.play('showTarget', 16, true);
    this.targetImage.smoothed = true;
    this.targetImage.scale.setTo(size / 256, size / 256);
    this.targetImage.anchor.setTo(0.5, 0.5);
    const animateTargetImage = () => {
      const zoomInStart = this.game.add.tween(this.targetImage.scale)
        .to({ x: 0.25, y: 0.25 }, 500, Phaser.Easing.Linear.None, false, 5000);
      const zoomOutEnd = this.game.add.tween(this.targetImage.scale)
        .to({ x: size / 256, y: size / 256 }, 500, Phaser.Easing.Linear.None);
      zoomInStart.chain(zoomOutEnd);
      zoomOutEnd.onComplete.add(animateTargetImage);
      zoomInStart.start();
    };
    animateTargetImage();
  }

  resizeGame() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth;
    const height = docElement.clientHeight;
    this.game.width = width;
    this.game.height = height;
    this.game.renderer.resize(width, height);
  }

  positionElements() {
    const ratio = getRatio(this.backgroundImage, this.game);
    this.backgroundImage.scale.setTo(ratio, ratio);
    this.backgroundImage.x = this.game.world.centerX;
    this.backgroundImage.y = this.game.world.centerY;
    if (this.targetImage) {
      this.targetImage.centerX = this.backgroundImage.left + (this.currentLevel.centerX * ratio);
      this.targetImage.centerY = this.backgroundImage.top + (this.currentLevel.centerY * ratio);
    }
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.backgroundImage);
    }
  }

  update() {
    // console.log('positions', this.getWorldPointFromPixelPoint(this.mousePosWorld));
    // this.game.camera.scale = this.game.camera.scale + 0.1;
    // console.log('update', fps);
    // this.game.world.Step(1 / fps, 8, 3);
    // this.game.world.ClearForces();

    // if ( imagesLoaded ) {
    //   positionImages();
    // }
  }

  guiadoClick(image, pointer) {
    const relativeX = pointer.x - image.left;
    console.log(relativeX);
    console.log('image current width', image.width);
    console.log('image original width', image.texture.width);
  }
}
