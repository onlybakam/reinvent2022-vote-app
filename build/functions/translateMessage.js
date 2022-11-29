// src/libs/index.ts
import { util } from "@aws-appsync/utils";
function translateTextRequest(text, source, target) {
  return {
    method: "POST",
    resourcePath: "/",
    params: {
      headers: {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AWSShineFrontendService_20170701.TranslateText"
      },
      body: JSON.stringify({
        Text: text,
        SourceLanguageCode: source,
        TargetLanguageCode: target
      })
    }
  };
}
function translateTextResponse(result) {
  console.log("Translate result:", result);
  if (result.statusCode !== 200) {
    console.log("ahhhh error", result);
    util.appendError(result.body, `${result.statusCode}`);
  }
  const body = JSON.parse(result.body);
  return body.TranslatedText;
}

// src/common/messages.ts
var messages = [
  {
    code: "FR" /* FR */,
    message: "Allez les lions!"
  }
];

// src/functions/translateMessage.ts
function request(ctx) {
  const vote = ctx.prev.result;
  const message = messages[vote.msgId];
  return translateTextRequest(message.message, message.code, "EN");
}
function response(ctx) {
  const text = translateTextResponse(ctx.result);
  const prev = ctx.prev.result;
  prev.message = text;
  return prev;
}
export {
  request,
  response
};
