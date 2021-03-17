import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { PaginatedPosts, PostsQuery } from "../generated/graphql";

import theme from "../theme";

const client = new ApolloClient({
  credentials: "include",
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: {
                  ...(existing?.posts || []),
                  ...incoming.posts,
                },
              };
            },
          },
        },
      },
    },
  }),
});

interface IProps {
  Component: any;
  pageProps: any;
}

function MyApp({ Component, pageProps }: IProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
