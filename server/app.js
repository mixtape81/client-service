import express from 'express';
import graphqlHTTP from 'express-graphql';
import DataLoader from 'dataloader';
import schema from './graphql/schema';
import db from '../database/database';

const app = express();

// This endpoint serves queries to the users database
app.use('/graphql', graphqlHTTP(() => {
/* locationLoader memoizes locations previously queried to prevent multiple
 * look-ups. Location IDs are passed in from the GraphQL schema, and the
 * loader stores previous look-ups to be referenced during the same query. It
 * then passes the loader to the GraphQL schema.
 */
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
