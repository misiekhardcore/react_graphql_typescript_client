import { Box } from "@chakra-ui/layout";
import React from "react";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
