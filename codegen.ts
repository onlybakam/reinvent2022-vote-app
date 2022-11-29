
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["src/schema.graphql", "src/aws.gql"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", 'typescript-operations'],
      config: {
        scalars: {
          "AWSDateTime": "Date"
        }
      }
    }
  }
};

export default config;
