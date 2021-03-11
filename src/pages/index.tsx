import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Link } from "@chakra-ui/layout";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <div>hello world</div>
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
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
