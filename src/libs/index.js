"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToSNSRequest = void 0;
const utils_1 = require("@aws-appsync/utils");
function publishToSNSRequest(topicArn, values) {
    const arn = utils_1.util.urlEncode(topicArn);
    const message = utils_1.util.urlEncode(JSON.stringify(values));
    const parts = [
        'Action=Publish',
        'Version=2010-03-31',
        `TopicArn=${arn}`,
        `Message=${message}`,
    ];
    const body = parts.join('&');
    return {
        method: 'POST',
        resourcePath: '/',
        params: {
            body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        },
    };
}
exports.publishToSNSRequest = publishToSNSRequest;
