'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  MONGODB_USERNAME: username,
  MONGODB_PASSWORD: password,
  MONGODB_HOST: host,
  MONGODB_PORT: port,
  MONGODB_DATABASE_NAME: databaseName,
  MLAB_USER: mlab_user,
  MLAB_PASSWORD: mlab_password
} = _config2.default;

_mongoose2.default.Promise = global.Promise;

const MONGODB_URI = `mongodb+srv://${mlab_user}:${mlab_password}@cluster0-b9rob.mongodb.net/weaverseV3?retryWrites=true`;

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/weaverse'


console.log('MONGO CONNECTION', MONGODB_URI);
const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  useNewUrlParser: true
};

_mongoose2.default.connect(MONGODB_URI, options);
_mongoose2.default.set('useCreateIndex', true);

_mongoose2.default.connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.info(`Connected to MongoDB`);
});
_mongoose2.default.connection.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(`MongoDB connection error:`, err);
  process.exit(-1);
});

_mongoose2.default.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.error('MongoDB disconnected');
});

exports.default = _mongoose2.default;
//# sourceMappingURL=mongoose.js.map