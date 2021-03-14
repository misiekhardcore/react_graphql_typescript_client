import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
  const [, vote] = useVoteMutation();
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
          setLoadingState("updoot-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
      />
      {post.points}
      <IconButton
        aria-label="Vote down"
        icon={<ChevronDownIcon />}
        size="sm"
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
      />
    </Flex>
  );
};
