import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'wiki';
const client = await MongoClient.connect(url);

export default client;