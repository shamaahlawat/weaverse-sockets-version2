"use strict";

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const request = require("request");
var FCM = require("fcm-push");
async function notify(fcm_token, data) {
    var options = {
        method: "POST",
        url: _config2.default.FCM_URL,
        headers: {
            Authorization: _config2.default.FCM_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: {
                notification: data
            },
            to: fcm_token
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(options, response.body);
    });
}

module.exports = { notify };
//# sourceMappingURL=notify.js.map