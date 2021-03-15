import { Box, Heading, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post: React.FC<{}> = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: { id: intId },
  });
  if (fetching)
    return (
      <Layout>
        <Box>loading...</Box>
      </Layout>
    );

  if (error) {
    return <Layout>{error.message}</Layout>;
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
          <Heading>{data.post.title}</Heading>
          <Text>{data.post.text}</Text>
        </Box>
      </Layout>
    );
  return null;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
