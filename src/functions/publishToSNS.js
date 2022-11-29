"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.request = void 0;
const utils_1 = require("@aws-appsync/utils");
const libs_1 = require("../libs");
function request(ctx) {
    const { TOPIC_ARN } = ctx.stash;
    const { input: { country, guestId, msgId } } = ctx.arguments;
    return (0, libs_1.publishToSNSRequest)(TOPIC_ARN, '');
}
exports.request = request;
function response(ctx) {
    const result = ctx.result;
    if (result.statusCode === 200) {
        // if response is 200
        // Because the response is of type XML, we are going to convert
        // the result body as a map and only get the User object.
        const body = utils_1.util.xml.toMap(result.body);
        console.log('respone body -->', body);
        return body.PublishResponse.PublishResult;
    }
    // if response is not 200, append the response to error block.
    utils_1.util.appendError(result.body, `${result.statusCode}`);
}
exports.response = response;
