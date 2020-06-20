import { ApolloCache } from 'apollo-cache';
import { StoreObject } from 'apollo-cache-inmemory';
import { Resolvers } from 'apollo-client';
import { v4 as uuidv4 } from 'uuid';

import { Todo, Todos, Filter } from 'ui/modules/todos/types';
import {
  GET_TODOS,
  TODO_FRAGMENT,
} from 'ui/modules/todos/components/todo-list';

import { formatDate } from 'ui/utils/formatDate';

type ResolverFn = (
  parent: any,
  args: any,
  {
    cache,
    getCacheKey,
  }: {
    cache: ApolloCache<any>;
    getCacheKey: (storeObj: StoreObject) => string;
  }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Mutation: {
    createTodo: (_, { text }: { text: string }, { cache }) => {
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

      return null;
    },
    updateTodo: (
      _,
      { id, text }: { id: string; text: string },
      { cache, getCacheKey }
    ) => {
      const todo = cache.readFragment<Todo>({
        id: getCacheKey({ id, __typename: 'Todo' }),
        fragment: TODO_FRAGMENT,
      });

      const updatedTodo = { ...todo, text };

      cache.writeFragment({
        id: getCacheKey({ id, __typename: 'Todo' }),
        fragment: TODO_FRAGMENT,
        data: updatedTodo,
      });

      return null;
    },
    removeTodo: (_, { id }: { id: string }, { cache }) => {
      const data = cache.readQuery<Todos>({ query: GET_TODOS });

      const todos = data?.todos.filter((todo) => todo.id !== id);

      cache.writeQuery({
        query: GET_TODOS,
        data: { todos },
      });

      return null;
    },
    toggleTodo: (_, { id }: { id: string }, { cache, getCacheKey }) => {
      const todo = cache.readFragment<Todo>({
        id: getCacheKey({ id, __typename: 'Todo' }),
        fragment: TODO_FRAGMENT,
      });

      cache.writeFragment({
        id: getCacheKey({ id, __typename: 'Todo' }),
        fragment: TODO_FRAGMENT,
        data: { ...todo, completed: !todo?.completed },
      });

      return null;
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
