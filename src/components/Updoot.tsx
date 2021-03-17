import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootProps {
  post: PostSnippetFragment;
}

export const Updoot: React.FC<UpdootProps> = ({ post }) => {
  //state can be used to show loading on button
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Flex
      mr={8}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        aria-label="Vote up"
        icon={<ChevronUpIcon />}
        size="sm"
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({ variables: { postId: post.id, value: 1 } });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "updoot-loading"}
      />
      {post.points}
      <IconButton
        aria-label="Vote down"
        icon={<ChevronDownIcon />}
        size="sm"
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({ variables: { postId: post.id, value: -1 } });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loading"}
      />
    </Flex>
  );
};
