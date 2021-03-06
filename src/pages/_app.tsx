import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";

interface IProps {
  Component: any;
  pageProps: any;
}

function MyApp({ Component, pageProps }: IProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
