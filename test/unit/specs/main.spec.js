import Main from '../../../src/main/Main';

describe('main launches the game', () => {
  describe('when no cordova', () => {
    it('initializes calling Boot', () => {
      const main = new Main();
      main.mainGame.state.start = sinon.spy();

      main.init();

      expect(main.mainGame.state.start).to.have.been.called;
    });
  });

  describe('when cordova', () => {
    it('initializes calling Boot', () => {
      window.cordova = { device: { } };
      const main = new Main();
      main.mainGame.state.start = sinon.spy();

      main.init();
      document.dispatchEvent(new Event('deviceready'));

      expect(main.mainGame.state.start).to.have.been.called;
    });
  });
});
