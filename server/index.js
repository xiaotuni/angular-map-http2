const path = require('path');

require('babel-register');
require('babel-polyfill');

const filePath = path.join(__dirname, 'main.js');

require(filePath);