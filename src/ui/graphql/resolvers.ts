import { ApolloCache } from 'apollo-cache';
import { Resolvers } from 'apollo-client';
import { v4 as uuidv4 } from 'uuid';

import { Todo, Todos, Filter } from 'ui/modules/todos/types';
import { GET_TODOS } from 'ui/modules/todos/components/todo-list';

import { formatDate } from 'ui/utils/formatDate';

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Mutation: {
    createTodo: (_, { text }: { text: string }, { cache }): Todo => {
      const data = cache.readQuery<Todos>({ query: GET_TODOS });

      const newTodo: Todo = {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: formatDate(new Date()),
        __typename: 'Todo',
      };

      cache.writeQuery({
        query: GET_TODOS,
        data: { todos: [newTodo, ...(data?.todos ?? [])] },
      });

      return newTodo;
    },
    updateTodo: (
      _,
      { id, text }: { id: string; text: string },
      { cache }
    ): Todo[] => {
      return [];
    },
    removeTodo: (_, { id }: { id: string }, { cache }): Todo[] => {
      return [];
    },
    toggleTodo: (_, { id }: { id: string }, { cache }): Todo[] => {
      return [];
    },
    serVisibilityFilter: (
      _,
      { filter }: { filter: Filter },
      { cache }
    ): Filter => {
      return filter;
    },
  },
};
