import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import db from '../database/database';

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */

const todoType = new GraphQLObjectType({
  name: 'todo',
  description: 'todo item',
  fields: () => ({
    itemId: {
      type: (GraphQLInt),
      description: 'The id of the todo.'
    },
    item: {
      type: GraphQLString,
      description: 'The name of the todo.'
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Completed todo? '
    }
  })
});

const getProjection = (fieldASTs) => {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      todo: {
        type: new GraphQLList(todoType),
        args: {
          itemId: {
            name: 'itemId',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (root, { itemId }, source, fieldASTs) => {
          const projections = getProjection(fieldASTs);
          const foundItems = new Promise((resolve, reject) => {
            db.User.find({itemId}, projections,(err, todos) => {
              err ? reject(err) : resolve(todos)
            });
          });

          return foundItems;
        }
      }
    }
  })
});

export default {
  schema,
  getProjection
};
