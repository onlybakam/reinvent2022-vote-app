import { util, HTTPRequest, DynamoDBPutItemRequest, Key, Context } from '@aws-appsync/utils';

export type AppContext<TArgs, TResult = null, TPrevResult=null> = Omit<Context, 'arguments' | 'result'> & {
  arguments: TArgs
  result: TResult
  prev: { result: TPrevResult}
}

export function publishToSNSRequest(topicArn: string, values: unknown): HTTPRequest {
  const arn = util.urlEncode(topicArn);
  const message = util.urlEncode(JSON.stringify(values));
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

export type HTTPResponse = {
  statusCode: number;
  body: string;
};
export type SNSResponseBody = {
  PublishResponse: {
    PublishResult: {
      MessageId: string;
      SequenceNumber?: string;
    };
  };
};
export function publishToSNSResponse(result: HTTPResponse) {
  if (result.statusCode !== 200) {
    console.log('ahhhh error', result);
    util.appendError(result.body, `${result.statusCode}`);
  }
  const body = util.xml.toMap(result.body) as SNSResponseBody;
  console.log('respone body -->', body);
  return body.PublishResponse.PublishResult;
}

export function translateTextRequest(
  text: string,
  source: string,
  target: string
): HTTPRequest {
  return {
    method: 'POST',
    resourcePath: '/',
    params: {
      headers: {
        'content-type': 'application/x-amz-json-1.1',
        'x-amz-target': 'AWSShineFrontendService_20170701.TranslateText',
      },
      body: JSON.stringify({
        Text: text,
        SourceLanguageCode: source,
        TargetLanguageCode: target,
      }),
    },
  };
}

export function translateTextResponse(result: HTTPResponse) {
  console.log('Translate result:', result);
  if (result.statusCode !== 200) {
    console.log('ahhhh error', result);
    util.appendError(result.body, `${result.statusCode}`);
  }
  const body = JSON.parse(result.body);
  return body.TranslatedText as string;
}

type PutParams = {
  key: Key;
  values: Record<string, unknown>;
  condition: Record<string, unknown>;
};

export function put(params: PutParams): DynamoDBPutItemRequest {
  const { key, values, condition } = params;
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues(key),
    attributeValues: util.dynamodb.toMapValues(values),
    condition: getCondition(condition),
  };
}

function getCondition(inCondObj: Record<string, unknown>) {
  if (!inCondObj) return null;
  const condition = JSON.parse(util.transform.toDynamoDBConditionExpression(inCondObj));
  if (
    condition &&
    condition.expressionValues &&
    !Object.keys(condition.expressionValues).length
  ) {
    delete condition.expressionValues;
  }
  return condition;
}
