import { withUrqlClient } from "next-urql";
import { Navbar } from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>hello world</div>
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
