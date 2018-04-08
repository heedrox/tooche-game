import MainGame from './MainGame';
import MainCordovaLauncher from './MainCordovaLauncher';

class Main {
  constructor() {
    this.mainGame = new MainGame();
  }

  init() {
    if (!window.cordova) {
      this.mainGame.init();
    } else {
      const app = new MainCordovaLauncher(this.mainGame);
      app.initialize();
    }
  }
}

export default Main;

