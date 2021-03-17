import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/layout";
import NextLink from "next/link";
import { useState } from "react";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { Updoot } from "../components/Updoot";
import { useMeQuery, usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const { data: meData } = useMeQuery();
  const { data, loading } = usePostsQuery({
    variables,
  });

  if (!loading && !data) {
    return <div>you got no posts for some reason</div>;
  }

  return (
    <Layout>
      {!data || loading ? (
        <p>loading...</p>
      ) : (
        <Stack spacing={8} mt={4}>
          {data.posts.posts.map((post) =>
            !post ? null : (
              <Flex
                key={post.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                alignItems="center"
              >
                {meData?.me && <Updoot post={post} />}
                <Box flex={1}>
                  <NextLink href="post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title} </Heading>
                    </Link>
                  </NextLink>
                  <Text fontSize="sm" color="gray.500">
                    posted by {post.creator.username}
                  </Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
                {post.creatorId === 1}
                <EditDeletePostButtons
                  creatorId={post.creatorId}
                  id={post.id}
                />
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                ...variables,
                cursor:
                  data.posts.posts[data.posts.posts.length - 1]
                    .createdAt,
              });
            }}
            isLoading={loading}
            m="auto"
            my={4}
          >
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
