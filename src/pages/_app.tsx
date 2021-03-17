import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";

const client = new ApolloClient({
  credentials: "include",
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
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
