import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { aws_appsync as appsyncCfn } from 'aws-cdk-lib';
import * as path from 'path';
import * as fs from 'fs';
import {
  BaseAppsyncFunctionProps,
  BaseDataSource,
  BaseResolverProps,
} from '@aws-cdk/aws-appsync-alpha';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const region = Stack.of(this).region;

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'ReinventDemoAPI',
      schema: appsync.Schema.fromAsset(path.join(__dirname, '../../src/schema.graphql')),
      logConfig: {
        retention: logs.RetentionDays.ONE_WEEK,
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        excludeVerboseContent: false,
      },
    });

    const topic = new sns.Topic(this, 'topic');
    const snsDS = api.addHttpDataSource('sns', `https://sns.${region}.amazonaws.com`, {
      authorizationConfig: { signingRegion: region, signingServiceName: 'sns' },
    });
    snsDS.node.addDependency(topic);
    topic.grantPublish(snsDS.grantPrincipal);

    const publishFn = createFunction(this, snsDS, {
      name: 'publishToSNS',
      code: path.join(__dirname, './../../build/functions/publishToSNS.js'),
    });

    const table = new dynamodb.Table(this, 'messages', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
    const tableDS = api.addDynamoDbDataSource('messages', table);
    const putItemFn = createFunction(this, tableDS, {
      name: 'putItem',
      code: path.join(__dirname, './../../build/functions/saveToDynamodb.js'),
    })

    const translateDS = api.addHttpDataSource('translate', `https://translate.${region}.amazonaws.com`, {
      authorizationConfig: { signingRegion: region, signingServiceName: 'translate' },
    });
    iam.Grant.addToPrincipal({
      grantee: translateDS.grantPrincipal,
      actions: ['translate:TranslateText'],
      resourceArns: ['*'],
    })
    const translateFn = createFunction(this, translateDS, {
      name: 'translate',
      code: path.join(__dirname, './../../build/functions/translateMessage.js'),
    })

    const resolver = createResolver(this, api, {
      typeName: 'Mutation',
      fieldName: 'plusOne',
      pipelineConfig: [publishFn, putItemFn, translateFn],
      code: /* JavaScript */`
export function request(ctx) {
  ctx.stash.TOPIC_ARN = '${topic.topicArn}'
  return {};
}
export function response(ctx) {
  return ctx.prev.result;
}`,
    });



    new CfnOutput(this, 'graphqlEndpoint', { value: api.graphqlUrl })
    new CfnOutput(this, 'region', { value: region })
    new CfnOutput(this, 'authenticationType', { value: 'API_KEY'})
    new CfnOutput(this, 'apiKey', { value: api.apiKey! })
    new CfnOutput(this, 'apiId', { value: api.apiId })
  }
}

type Props = BaseAppsyncFunctionProps & {
  code: string;
};
function createFunction(scope: Construct, ds: BaseDataSource, props: Props) {
  const fn = new appsyncCfn.CfnFunctionConfiguration(scope, `${props.name}Function`, {
    name: props.name,
    apiId: ds.ds.apiId,
    dataSourceName: ds.name,
    functionVersion: '2018-05-29',
  });
  fn.addOverride('Properties.Runtime.Name', 'APPSYNC_JS');
  fn.addOverride('Properties.Runtime.RuntimeVersion', '1.0.0');
  fn.addOverride('Properties.Code', fs.readFileSync(props.code, 'utf8'));
  fn.node.addDependency(ds);
  return appsync.AppsyncFunction.fromAppsyncFunctionAttributes(
    scope,
    `import${fn.attrFunctionId}`,
    { functionArn: fn.attrFunctionArn }
  );
}

type ResolverProps = BaseResolverProps & {
  code: string;
};
function createResolver(scope: Construct, api: appsync.GraphqlApi, props: ResolverProps) {
  const pipelineConfig =
    props.pipelineConfig && props.pipelineConfig.length
      ? { functions: props.pipelineConfig.map((func) => func.functionId) }
      : { functions: [] };
  const resolver = new appsyncCfn.CfnResolver(
    scope,
    `${props.typeName}${props.fieldName}Resolver`,
    {
      apiId: api.apiId,
      typeName: props.typeName,
      fieldName: props.fieldName,
      kind: 'PIPELINE',
      pipelineConfig,
    }
  );
  resolver.addOverride('Properties.Runtime.Name', 'APPSYNC_JS');
  resolver.addOverride('Properties.Runtime.RuntimeVersion', '1.0.0');
  resolver.addOverride('Properties.Code', props.code);
  resolver.node.addDependency(api);
  return resolver;
}
