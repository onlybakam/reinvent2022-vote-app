// src/functions/publishToSNS.ts
import { util as util2 } from "@aws-appsync/utils";

// src/libs/index.ts
import { util } from "@aws-appsync/utils";
function publishToSNSRequest(topicArn, values) {
  const arn = util.urlEncode(topicArn);
  const message = util.urlEncode(JSON.stringify(values));
  const parts = [
    "Action=Publish",
    "Version=2010-03-31",
    `TopicArn=${arn}`,
    `Message=${message}`
  ];
  const body = parts.join("&");
  return {
    method: "POST",
    resourcePath: "/",
    params: {
      body,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  };
}
function publishToSNSResponse(result) {
  if (result.statusCode !== 200) {
    console.log("ahhhh error", result);
    util.appendError(result.body, `${result.statusCode}`);
  }
  const body = util.xml.toMap(result.body);
  console.log("respone body -->", body);
  return body.PublishResponse.PublishResult;
}

// src/common/messages.ts
var messages = [
  {
    code: "FR" /* FR */,
    message: "Allez les lions!"
  }
];

// src/functions/publishToSNS.ts
function request(ctx) {
  const { TOPIC_ARN } = ctx.stash;
  const { input } = ctx.arguments;
  const message = {
    ...input,
    message: messages[input.msgId],
    received: util2.time.nowISO8601()
  };
  return publishToSNSRequest(TOPIC_ARN, message);
}
function response(ctx) {
  const result = publishToSNSResponse(ctx.result);
  console.log(`succesfully published to sns, ${result}`);
  return true;
}
export {
  request,
  response
};
