import { DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { MutationPlusOneArgs, Vote } from '../generated/graphql';
import { AppContext, put } from 'brice-handy-appsync-libs';

export function request(ctx: AppContext<MutationPlusOneArgs>): DynamoDBPutItemRequest {
  const { input } = ctx.arguments;
  const key = { id: util.autoId() };
  const values = {
    ...input,
    createdAt: util.time.nowISO8601()
  }
  const condition = { id: { attributeExists: false } };
  return put({ key, values, condition });
}

export function response(ctx: AppContext<MutationPlusOneArgs, Vote>) {
  const { error, result } = ctx;
  if (error) {
    util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
