class MainDirectLauncher {
  constructor(mainGame) {
    this.mainGame = mainGame;
  }

  initialize() {
    this.mainGame.init();
  }
}

export default MainDirectLauncher;
