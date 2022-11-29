// src/functions/saveToDynamodb.ts
import { util as util2 } from "@aws-appsync/utils";

// src/libs/index.ts
import { util } from "@aws-appsync/utils";
function put(params) {
  const { key, values, condition } = params;
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues(key),
    attributeValues: util.dynamodb.toMapValues(values),
    condition: getCondition(condition)
  };
}
function getCondition(inCondObj) {
  if (!inCondObj)
    return null;
  const condition = JSON.parse(util.transform.toDynamoDBConditionExpression(inCondObj));
  if (condition && condition.expressionValues && !Object.keys(condition.expressionValues).length) {
    delete condition.expressionValues;
  }
  return condition;
}

// src/functions/saveToDynamodb.ts
function request(ctx) {
  const { input: values } = ctx.arguments;
  const key = { id: util2.autoId() };
  const condition = { id: { attributeExists: false } };
  return put({ key, values, condition });
}
function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    util2.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
export {
  request,
  response
};
