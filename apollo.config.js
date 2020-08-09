exports.client = {
  includes: ['./src/**/*.tsx', './src/**/*.ts'],
  excludes: [
    '**/node_modules'
  ],
  target: 'typescript',
  tagName: 'gql',
  service: {
    name: 'wiki-js',
    localSchemaFile: 'schema.graphql'
  }
}