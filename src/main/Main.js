import MainGame from './MainGame';
import MainCordovaLauncher from './MainCordovaLauncher';
import MainDirectLauncher from './MainDirectLauncher';

const getMainLauncher = () => (window.cordova ? MainCordovaLauncher : MainDirectLauncher);
class Main {
  constructor() {
    this.mainGame = new MainGame();
  }

  init() {
    const LauncherClass = getMainLauncher();
    const app = new LauncherClass(this.mainGame);
    app.initialize();
  }
}

export default Main;

