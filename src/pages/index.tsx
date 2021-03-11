import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  });

  if (!fetching && !data) {
    return <div>you got no posts for some reason</div>;
  }

  return (
    <Layout>
      <Flex align="baseline">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <p>loading...</p>
      ) : (
        <Stack spacing={8} mt={4}>
          {data!.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button isLoading={fetching} m="auto" my={4}>
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
