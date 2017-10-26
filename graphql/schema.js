import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';
import GraphQLDate from 'graphql-date';

import db from '../database/database';

const locationType = new GraphQLObjectType({
  name: 'location',
  description: 'user\'s location',
  fields: () => ({
    id: {
      type: (GraphQLInt),
      description: 'Location ID'
    },
    name: {
      type: (GraphQLString),
      description: 'Location name'
    }
  })
});

const userType = new GraphQLObjectType({
  name: 'user',
  description: 'service user',
  fields: () => ({
    id: {
      type: (GraphQLInt),
      description: 'A user\'s ID'
    },
    createdAt: {
      type: (GraphQLDate),
      description: 'A user\'s join date'
    },
    age: {
      type: (GraphQLInt),
      description: 'A user\'s age between 18 - 70'
    },
    paidStatus: {
      type: (GraphQLBoolean),
      description: 'True if a paid user, false otherwise'
    },
    genreGroup: {
      type: (GraphQLInt),
      description: 'A number which identifies a user as belonging to a certain genre cluster'
    },
    favoriteArtists: {
      type: new GraphQLList(GraphQLInt),
      description: 'A list of the user\'s 5 favorite artists\' IDs'
    },
    favoriteGenres: {
      type: new GraphQLList(GraphQLInt),
      description: 'A list of the user\'s 5 favorite genres\' IDs'
    },
    location: {
      type: locationType,
      resolve: user => db.Location.find({ where: { id: user.locationId } })
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(userType),
        resolve: () => db.User.findAll()
          .then(results => results)
          .catch(err => console.error(err))
      }
    }
  })
});

export default schema;
