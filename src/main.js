/* eslint-disable no-console */
import 'pixi';
import 'p2';
import Main from './main/Main';

window.main = new Main();

if (window.cordova) {
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
      window.main.state.start('Boot');
    },

    receivedEvent: (id) => {
      console.log(`Received Event: ${id}`);
    },
  };

  app.initialize();
}
