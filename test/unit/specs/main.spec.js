import Main from '../../../src/main/Main';

describe('main', () => {
  describe('when no cordova', () => {
    it('should initialize calling Boot', () => {
      const main = new Main();
      main.mainGame.state.start = sinon.spy();

      main.init();

      expect(main.mainGame.state.start).to.have.been.called;
    });
  });
});
