import { HTTPRequest, util } from '@aws-appsync/utils';
import { MutationPlusOneArgs } from "../generated/graphql";
import { messages } from "../common/messages";
import { publishToSNSRequest, HTTPResponse, AppContext, publishToSNSResponse } from "brice-handy-appsync-libs";

export function request(ctx: AppContext<MutationPlusOneArgs>): HTTPRequest {
  const { TOPIC_ARN } = ctx.stash;
  const { input } = ctx.arguments;
  const message = {
    ...input,
    message: messages[input.msgId],
    received: util.time.nowISO8601()
  }
  console.log('Publishing message to SNS', message)
  return publishToSNSRequest(TOPIC_ARN, message);
}

export function response(ctx: AppContext<MutationPlusOneArgs, HTTPResponse>) {
  const result = publishToSNSResponse(ctx.result)
  console.log(`succesfully published to sns:`, result)
  return true
}
