console.log('VOY');
global.chai = require('chai');
global.sinon = require('sinon');

global.chai.should();

global.expect = global.chai.expect;

global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-sorted'));
