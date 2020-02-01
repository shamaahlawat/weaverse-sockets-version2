'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.issueJWT = issueJWT;
exports.verifyJWT = verifyJWT;
exports.decodeJWT = decodeJWT;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import config from '../config';

const {
    TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_ALGO,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_ALGO
} = _config2.default;

if (!TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || !ACCESS_TOKEN_ALGO || !REFRESH_TOKEN_EXPIRY || !REFRESH_TOKEN_ALGO) {
    throw new Error('JWT settings not found in env');
}

async function issueJWT({ payload }) {
    const token = await _jsonwebtoken2.default.sign(payload, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return token;
}

async function verifyJWT({ token }) {
    const isValid = await _jsonwebtoken2.default.verify(token, TOKEN_SECRET);
    return isValid;
}

async function decodeJWT({ token }) {
    const decoded = await _jsonwebtoken2.default.decode(token, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return decoded;
}
//# sourceMappingURL=jwt.js.map