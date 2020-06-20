import React, { useState, useEffect } from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { Spinner } from 'reactstrap';

import { resolvers } from 'ui/graphql/resolvers';
import { typeDefs } from 'ui/graphql/typeDefs';

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

      client.writeData(initialData);

      await persistCache({
        cache,
        storage: window.localStorage as PersistentStorage<
          PersistedData<NormalizedCacheObject>
        >,
      });

      setClient(client);
    })();
  }, []);

  if (!client) {
    return <Spinner type='grow' color='light' />;
  }

  return (
    <ApolloProvider client={client}>
      <h1>Apollo Client Local State</h1>
    </ApolloProvider>
  );
};
