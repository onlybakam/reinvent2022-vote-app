"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
exports.default = config;
