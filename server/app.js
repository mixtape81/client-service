import express from 'express';
import graphqlHTTP from 'express-graphql';
import DataLoader from 'dataloader';
import schema from './graphql/schema';
import db from '../database/database';

const app = express();

app.use('/graphql', graphqlHTTP(() => {
  const locationLoader = new DataLoader((keys) => {
    const promiseArray = [];
    keys.map(key => promiseArray.push(db.Location.findById(key)));
    return Promise.all(promiseArray);
  });
  const loaders = {
    location: locationLoader
  };
  return {
    context: { loaders },
    schema,
    graphiql: true
  };
}));

export default app;
