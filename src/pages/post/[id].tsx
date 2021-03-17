import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post: React.FC<{}> = () => {
  const [{ data, fetching, error }] = useGetPostFromUrl();
  if (fetching)
    return (
      <Layout>
        <Box>loading...</Box>
      </Layout>
    );

  if (error) {
    return (
      <Layout>
        <Box>{error.message}</Box>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>error ocurred</Box>
      </Layout>
    );
  }

  if (data)
    return (
      <Layout>
        <Box>
          <Flex>
            <Heading flex={1}>{data.post.title}</Heading>
            <EditDeletePostButtons
              creatorId={data.post.creatorId}
              id={data.post.id}
            />
          </Flex>
          <Text>{data.post.text}</Text>
        </Box>
      </Layout>
    );
  return null;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
