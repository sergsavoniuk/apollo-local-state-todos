import React, { useState, useEffect } from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import gql from 'graphql-tag';
import { Spinner } from 'reactstrap';

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
        typeDefs: `
          type User {
            name: String!
          }

          type Query {
            user: User
          }
        `,
        resolvers: {},
      });

      client.writeData({
        data: { user: { name: 'Test', __typename: 'User' } },
      });

      client
        .query({
          query: gql`
            {
              user {
                name
              }
            }
          `,
        })
        .then((result) => console.log(result));

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
