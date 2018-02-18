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

    this.game.camera.scale = 1;
    this.lastMousePosPixel = { x: 0, y: 0 };
    this.mousePosWorld = { x: 0, y: 0 };
    this.haveMultiTouch = false;
    this.haveAnyTouch = false;
    this.touchPos0 = null;
    this.touchPos1 = null;
    this.pinchZoomStartMidpoint = { x: 0, y: 0 };
    this.pinchZoomStartSeparation = null;

    // this.mouseDownQueryCallback = new MouseDownQueryCallback();

    this.canvasOffset = { x: 0, y: 0 };

    // this.game.input.mouse.mouseWheelCallback = mouseWheelCallback;
    this.game.input.onDown.add(this.onPointerDown.bind(this), this);
    this.game.input.moveCallback = this.onPointerMove.bind(this);
    this.game.input.onUp.add(this.onPointerUp.bind(this), this);

    this.game.input.pointer1.move = this.onMultitouchMove.bind(this);
    this.game.input.pointer2.move = this.onMultitouchMove.bind(this);

    this.setViewCenterWorld({ x: 1000, y: 240 });
  }


  getViewCenterWorld() {
    return { x: this.game.width / 2, y: this.game.height / 2 };
  }

  setViewCenterWorld(worldPos) {
    const currentViewCenterWorld = this.getViewCenterWorld();
    const toMoveX = worldPos.x - currentViewCenterWorld.x;
    const toMoveY = worldPos.y - currentViewCenterWorld.y;
    this.canvasOffset.x -= toMoveX * this.PTM;
    this.canvasOffset.y += toMoveY * this.PTM;
  }

  updateMousePos(event) {
    let mousePosPixel;
    console.log('update mouse pos', event);

    if (event.offsetX) {
      mousePosPixel = {
        x: event.offsetX,
        y: event.offsetY,
      };
    } else if (event.x) {
      mousePosPixel = {
        x: event.x,
        y: event.y,
      };
    } else {
      mousePosPixel = {
        x: event.clientX,
        y: event.clientY,
      };
      if (event.target && event.target.offsetLeft) {
        mousePosPixel.x -= event.target.offsetLeft;
      }
      if (event.target && event.target.offsetTop) {
        mousePosPixel.y -= event.target.offsetTop;
      }
    }

    this.mousePosWorld = mousePosPixel;
  }

  onPointerDown(event) {
    console.log('clientx', event.clientX);
    if (event.clientX < 0) {
      return;
    }
    this.updateMousePos(event);
    // this.lastMousePosPixel = { x: event.clientX, y: event.clientY };
  }

  onPointerMove(event) {
    this.updateMousePos(event);

    this.haveMultiTouch = this.game.input.pointer1.isDown && this.game.input.pointer2.isDown;
    this.haveAnyTouch = this.game.input.pointer1.isDown || this.game.input.pointer2.isDown;

    // console.log('on pointer move', event, others);
    if (this.game.input.activePointer.isDown || this.haveAnyTouch) {
      // pan view
      // console.log('going to change canvas', event.identifier);
      if (/* event.identifier === 0 && */!this.haveMultiTouch) {
        this.canvasOffset.x += event.clientX - this.lastMousePosPixel.x;
        this.canvasOffset.y += event.clientY - this.lastMousePosPixel.y;
      }
    }
    this.lastMousePosPixel = { x: event.clientX, y: event.clientY };
  }

  onPointerUp(event) {
    console.log('up clientx', event.clientX);
    this.haveMultiTouch = this.game.input.pointer1.isDown && this.game.input.pointer2.isDown;
    this.haveAnyTouch = this.game.input.pointer1.isDown || this.game.input.pointer2.isDown;
    // this.lastMousePosPixel = { x: event.clientX, y: event.clientY };
  }

  pointMidpoint(pt0, pt1) {
    const mx = 0.5 * (pt0.x + pt1.x);
    const my = 0.5 * (pt0.y + pt0.y);
    return { x: mx, y: my };
  }

  pointSeparation(pt0, pt1) {
    const dx = pt0.x - pt1.x;
    const dy = pt0.y - pt1.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }


  onMultitouchMove(event) {
    console.log('multitouch move', event);
    switch (event.identifier) {
      case 0:
        this.touchPos0 = { x: event.clientX, y: event.clientY };
        break;
      case 1:
        this.touchPos1 = { x: event.clientX, y: event.clientY };
        break;
      default:
        break;
    }

    const hadAnyTouchBefore = this.haveAnyTouch;
    const hadMultiTouchBefore = this.haveMultiTouch;
    this.haveMultiTouch = this.game.input.pointer1.isDown && this.game.input.pointer2.isDown;
    this.haveAnyTouch = this.game.input.pointer1.isDown || this.game.input.pointer2.isDown;

    if (!hadMultiTouchBefore && this.haveMultiTouch) {
      // starting multitouch
      this.pinchZoomStartMidpoint = this.pointMidpoint(this.touchPos0, this.touchPos1);
      this.pinchZoomStartSeparation = this.pointSeparation(this.touchPos0, this.touchPos1);
      if (this.mouseJoint) {
        this.game.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
      }
    } else if (hadMultiTouchBefore && this.haveMultiTouch) {
      // continuing multitouch
      const currentPinchZoomMidpoint = this.pointMidpoint(this.touchPos0, this.touchPos1);
      const currentPinchZoomSeparation = this.pointSeparation(this.touchPos0, this.touchPos1);

      const midPointWorld = this.getWorldPointFromPixelPoint(currentPinchZoomMidpoint);
      this.PTM *= currentPinchZoomSeparation / this.pinchZoomStartSeparation;
      const midPointPixelAfter = this.getPixelPointFromWorldPoint(midPointWorld);

      this.canvasOffset.x -= midPointPixelAfter.x - currentPinchZoomMidpoint.x;
      this.canvasOffset.y -= midPointPixelAfter.y - currentPinchZoomMidpoint.y;

      this.canvasOffset.x += currentPinchZoomMidpoint.x - this.pinchZoomStartMidpoint.x;
      this.canvasOffset.y += currentPinchZoomMidpoint.y - this.pinchZoomStartMidpoint.y;

      this.pinchZoomStartMidpoint = currentPinchZoomMidpoint;
      this.pinchZoomStartSeparation = currentPinchZoomSeparation;
    } else if (hadMultiTouchBefore && !this.haveMultiTouch) {
      // finishing multitouch
    } else if (!hadMultiTouchBefore && !this.haveMultiTouch) {
      // single touch moving
      if (!hadAnyTouchBefore) {
        this.onPointerDown(event); // feed the touch event to onPointerDown
      }
      // this.onPointerMove(event);
    }

    // this.lastMousePosPixel = { x: event.clientX, y: event.clientY };
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
