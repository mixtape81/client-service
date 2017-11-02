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

/* GraphQL schemas are defined as ObjectTypes, as seen by the locationType and
 * userType variables below. Since I'm querying a Postgres database, the fields
 * should match the column names of my tables. This makes it easy for the
 * resolve method in the GraphQLSchema instance to map values returned by the
 * database query to what was requested by the user. Each field has a type,
 * which indicates the type of value that will be returned by the query, as
 * well as an optional description. Note that a request may specify any number
 * of these fields, and will receive only those which were requested. Also note
 * that the location field for userType is a resolve method which uses the
 * loader from app.js in the server directory. This returns the name of the
 * location based on the relational integer stored for the user.
 */
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
      description: 'A user\'s unique id'
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
      resolve: (user, args, { loaders }) =>
        loaders.location.load(user.locationId)
    }
  })
});

/* The GraphQLSchema class defines the way in which a user may structure a
 * query through the GraphQL API. 'users' is the main field of query, which has
 * a type of 'userType' defined above. The type is defined as a list, meaning
 * that a query can be made for many users at once. 'args' defines the various
 * arguments that may be passed into the query, and sepcifies the value type
 * each argument must be. If an argument is passed that doesn't match the type
 * identified, the query will not be performed, and all arguments are optional.
 * Finally, schema is resolved through a Postgres query based on the arguments
 * passed in by the request. The results from the query are then mapped to the
 * 'userType' and the finish the request.
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(userType),
        args: {
          id: {
            name: 'id',
            description: 'Accepts an array of unique integers which represent a user\'s ID. If one integer is passed, the user with that ID will be returned. If two integers are passed, users with IDs within the range of the two integers (inclusive) will be returned. If more than two integers are passed, users with IDs between the first and last integers will be returned.',
            type: new GraphQLList(GraphQLInt)
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
            description: 'Accepts an array of integers which represent a user\'s age. If one integer is passed, users with that age will be returned. If two integers are passed, users with ages within the range of the two integers (inclusive) will be returned. If more than two integers are passed, users with ages between the first and last integers will be returned.',
            type: new GraphQLList(GraphQLInt)
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
          if (options.id) {
            options.id =
              { $between: [options.id[0], options.id[options.id.length - 1]] };
          }
          if (options.age) {
            options.age =
              { $between: [options.age[0], options.age[options.age.length - 1]] };
          }
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
