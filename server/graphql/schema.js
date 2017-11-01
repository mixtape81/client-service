// @flow

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import db from '../../database/database';

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
  name: 'users',
  description: 'service user',
  fields: () => ({
    id: {
      type: (GraphQLInt),
      description: 'A user\'s ID'
    },
    joinDate: {
      type: (GraphQLString),
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
        args: {
          id: {
            name: 'id',
            description: 'a unique integer representing one user',
            type: GraphQLInt
          },
          paidStatus: {
            name: 'paidStatus',
            description: 'a boolean indicating whether or not a user pays for the service',
            type: GraphQLBoolean
          },
          genreGroup: {
            name: 'genreGroup',
            description: 'an integer representing a user\'s genre group cluster',
            type: GraphQLInt
          },
          joinDate: {
            name: 'joinDate',
            description: 'user\'s join date in the format YYYYMMDD',
            type: GraphQLString
          },
          locationId: {
            name: 'locationId',
            description: 'a unique integer representing a city',
            type: GraphQLInt
          },
          age: {
            name: 'age',
            description: 'an integer between 18 - 90 (inclusive) representing a user\'s age',
            type: GraphQLInt
          },
          favoriteGenres: {
            name: 'favoriteGenres',
            description: 'an array of unique integers representing artists',
            type: new GraphQLList(GraphQLInt)
          },
          favoriteArtists: {
            name: 'favoriteGenres',
            description: 'an array of unique integers representing genres',
            type: new GraphQLList(GraphQLInt)
          }
        },
        resolve: (root, args) => {
          const options = Object.assign({}, args);
          if (options.favoriteGenres) {
            options.favoriteGenres = { $contains: options.favoriteGenres };
          }
          if (options.favoriteArtists) {
            options.favoriteArtists = { $contains: options.favoriteArtists };
          }
          return db.User.findAll({ where: options, raw: true })
            .then(results => results)
            .catch(err => console.error(err));
        }
      }
    }
  })
});

export default schema;
