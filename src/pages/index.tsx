import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/layout";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  });
  return (
    <Layout>
      {data ? (
        <Stack spacing={8}>
          {data.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <p>loading...</p>
      )}
      <br />
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
