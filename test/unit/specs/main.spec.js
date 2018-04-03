import Main from '../../../src/main/Main';

describe('main', () => {
  describe('when no cordova', () => {
    it('should initialize by itself', () => {
      const main = new Main();

      expect(main).not.to.be.undefined;
    });
  });
});
