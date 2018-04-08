import MainGame from './MainGame';

class Main {
  constructor() {
    this.mainGame = new MainGame();
  }

  init() {
    if (!window.cordova) {
      this.mainGame.init();
    } else {
      const app = {
        initialize: () => {
          document.addEventListener(
            'deviceready',
            this.onDeviceReady.bind(this),
            false,
          );
        },

        // deviceready Event Handler
        //
        onDeviceReady: () => {
          this.receivedEvent('deviceready');

          // When the device is ready, start Phaser Boot state.
          this.mainGame.init();
        },

        receivedEvent: (id) => {
          console.log(`Received Event: ${id}`);
        },
      };

      app.initialize();
    }
  }
}

export default Main;

