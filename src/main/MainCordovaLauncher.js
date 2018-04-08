class MainCordovaLauncher {
  constructor(mainGame) {
    this.mainGame = mainGame;
  }

  initialize() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false,
    );
  }

  onDeviceReady() {
    this.mainGame.init();
  }
}

export default MainCordovaLauncher;
