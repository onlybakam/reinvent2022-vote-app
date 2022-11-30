import { MutationPlusOneArgs, Vote } from "../generated/graphql";
import { translateTextResponse, translateTextRequest, HTTPResponse, AppContext } from 'brice-handy-appsync-libs';
import { messages } from "../common/messages";


export function request(ctx: AppContext<MutationPlusOneArgs, null, Vote>) {
  const vote = ctx.prev.result;
  const message = messages[vote.msgId]
  return translateTextRequest(message.text, message.code, 'EN')
}

export function response(ctx: AppContext<MutationPlusOneArgs, HTTPResponse, Vote>) {
  const text = translateTextResponse(ctx.result) as string
  const prev = ctx.prev.result
  prev.text = text
  return prev
}
