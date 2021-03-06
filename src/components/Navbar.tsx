import React from "react";
import { Box, Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { Button } from "@chakra-ui/button";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex color="white" bg="tomato" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
