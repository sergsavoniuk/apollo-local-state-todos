import React, { useState, useEffect } from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { Spinner } from 'reactstrap';

import { GET_TODOS } from './modules/todos/components/todo-list';

import { resolvers } from 'ui/graphql/resolvers';
import { typeDefs } from 'ui/graphql/typeDefs';

import { TodosPage } from 'ui/pages/todos';

import classes from './App.module.scss';

const initialData = {
  data: {
    todos: [],
    visibilityFilter: 'ALL',
  },
};

export const App: React.FC = () => {
  const [client, setClient] = useState<ApolloClient<
    NormalizedCacheObject
  > | null>(null);

  useEffect(() => {
    (async function createApolloClient() {
      const cache = new InMemoryCache();

      const client = new ApolloClient({
        link: new HttpLink({
          uri: '/graphql',
        }),
        cache,
        typeDefs,
        resolvers,
      });

      // cache.writeData(initialData);

      await persistCache({
        cache,
        storage: window.localStorage as PersistentStorage<
          PersistedData<NormalizedCacheObject>
        >,
      });

      try {
        cache.readQuery({ query: GET_TODOS });
      } catch {
        cache.writeData(initialData);
      }

      setClient(client);
    })();
  }, []);

  if (!client) {
    return <Spinner type='grow' color='secondary' />;
  }

  return (
    <ApolloProvider client={client}>
      <div className={classes.main}>
        <TodosPage />
      </div>
    </ApolloProvider>
  );
};
