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
const getTargetBoundaries = level => ({
  left: level.centerPressX - (level.size / 2),
  right: level.centerPressX + (level.size / 2),
  top: level.centerPressY - (level.size / 2),
  bottom: level.centerPressY + (level.size / 2),
});
const isWithinBoundaries = (x, y, boundaries, ratio) => x >= (boundaries.left * ratio)
  && (x <= boundaries.right * ratio)
  && (y >= boundaries.top * ratio)
  && (y <= boundaries.bottom * ratio);

export default class extends Phaser.State {
  constructor(isGuiado) {
    super();
    this.isGuiado = isGuiado;
  }
  init() {
    this.backgroundImage = null;
    this.numLevel = 0;
    this.currentLevel = LEVELS[this.numLevel];
    this.levelText = null;
    this.leftArrowControl = null;
    this.rightArrowControl = null;
  }

  create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.parentIsWindow = true;
    this.startTimer();
    this.paintLevel();
    this.game.scale.onOrientationChange.add((x) => {
      setTimeout(() => {
        console.log('orientation change', x);
        this.resizeGame();
        this.positionElements();
      }, 1000);
    });
  }

  paintLevel() {
    this.addBackgroundImage(this.currentLevel);
    if (!this.isGuiado) {
      this.addTarget(this.currentLevel);
    }
    this.addLevelText();
    this.addArrowControls();
    this.addTimerText();
    this.positionElements();
    if (this.numLevel === 0) {
      this.leftArrowControl.visible = false;
    } else {
      this.leftArrowControl.visible = true;
    }
  }

  addLevelText() {
    if (!this.levelText) {
      this.levelText = this.add.text(50, this.game.height - 100, this.numLevel + 1, { font: '32px Bangers', fill: '#000', align: 'left' });
    }
    this.updateText();
  }

  addTimerText() {
    if (this.isGuiado) {
      if (!this.timerText) {
        this.timerText = this.add.text(this.game.width - 100, this.game.height - 100, '', { font: '32px Bangers', fill: '#000', align: 'left' });
      }
    }
  }
  updateText() {
    this.levelText.text = this.numLevel + 1;
  }

  addArrowControls() {
    if (!this.leftArrowControl) {
      this.leftArrowControl = this.add.text(25, 25, '⬅️', { font: '32px Bangers', fill: '#000', align: 'left' });
      this.leftArrowControl.inputEnabled = true;
      this.leftArrowControl.events.onInputDown.add(this.previousLevel.bind(this), this);
    }
    if (!this.rightArrowControl) {
      this.rightArrowControl = this.add.text(this.game.width - 25, 75, '➡️', { font: '32px Bangers', fill: '#000', align: 'left' });
      this.rightArrowControl.inputEnabled = true;
      this.rightArrowControl.events.onInputDown.add(this.nextLevel.bind(this), this);
    }
  }

  addBackgroundImage(level) {
    if (this.backgroundImage) this.backgroundImage.destroy();
    this.backgroundImage = new BackgroundImage({
      game: this.game,
      asset: `image-${level.world}-${level.level}`,
    });
    this.game.add.existing(this.backgroundImage);
  }

  addTarget(level) {
    const size = level.size;
    if (this.targetImage) this.targetImage.destroy();
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
    if (this.levelText) {
      this.levelText.x = 25;
      this.levelText.y = this.game.height - 100;
    }
    if (this.leftArrowControl) {
      this.leftArrowControl.x = 25;
      this.leftArrowControl.y = 25;
    }
    if (this.rightArrowControl) {
      this.rightArrowControl.x = this.game.width - 50;
      this.rightArrowControl.y = 25;
    }

    if (this.isGuiado) {
      this.backgroundImage.inputEnabled = true;
      this.backgroundImage.events
        .onInputDown.add(this.guiadoClick.bind(this), this.backgroundImage);
    }
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.backgroundImage);
    }
  }

  update() {
    this.paintTimer();
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
    const ratio = getRatio(this.backgroundImage, this.game);
    const relativeX = pointer.clientX - image.left;
    const relativeY = pointer.clientY - image.top;
    const boundaries = getTargetBoundaries(this.currentLevel);
    if (isWithinBoundaries(relativeX, relativeY, boundaries, ratio)) {
      alert('YES!');
      this.nextLevel();
      if (this.numLevel >= LEVELS.length) {
        alert('¡FIN! ¡ENHORABUENA!');
      }
    } else {
      alert('WRONG!');
      this.restart();
    }
  }

  previousLevel() {
    this.numLevel = this.numLevel - 1;
    this.currentLevel = LEVELS[this.numLevel];
    this.paintLevel();
  }

  nextLevel() {
    this.numLevel = this.numLevel + 1;
    this.currentLevel = LEVELS[this.numLevel];
    if (typeof this.currentLevel !== 'undefined') {
      this.paintLevel();
    }
  }

  restart() {
    this.numLevel = 0;
    this.currentLevel = LEVELS[this.numLevel];
    this.paintLevel();
  }

  startTimer() {
    if (this.isGuiado) {
      this.timer = this.game.time.create(false);
      this.timer.loop(300000, this.endTimer.bind(this), this);
      this.timer.start();
    }
  }

  endTimer() {
    if (this.isGuiado) {
      this.timer = null;
      alert('TIME IS OVER!! ooooh :(');
    }
  }

  paintTimer() {
    if (this.timerText && this.isGuiado) {
      this.timerText.text = this.timer.duration.toFixed(0);
    }
  }
}
