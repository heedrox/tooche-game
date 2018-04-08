import 'pixi';
import 'p2';
import Phaser from 'phaser';
import SplashState from '../states/Splash';
import BootState from '../states/Boot';
import GameState from '../states/Game';

class MainGame extends Phaser.Game {
  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth;
    const height = docElement.clientHeight;
    const isGuiado = window.location.href.indexOf('guiado') > 0;


    super(width, height, Phaser.AUTO, 'content', null);

    this.state.add('Boot', new BootState(), false);
    this.state.add('Splash', new SplashState(isGuiado), false);
    this.state.add('Game', new GameState(isGuiado), false);
  }

  init() {
    this.state.start('Boot');
  }
}

export default MainGame;
