import CONFIG from "../config";
const request = require("request");
var FCM = require("fcm-push");
async function notify(fcm_token, data) {
    var options = {
        method: "POST",
        url: CONFIG.FCM_URL,
        headers: {
            Authorization: CONFIG.FCM_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: {
                notification: data
            },
            to: fcm_token
        })
    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(options, response.body);
    });

}


module.exports = { notify };