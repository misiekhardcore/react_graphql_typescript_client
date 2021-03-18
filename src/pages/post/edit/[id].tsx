import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import router from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { withApollo } from "../../../utils/withApollo";

const EditPost: React.FC<{}> = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    <Layout>
      <Box>loading...</Box>
    </Layout>;
  }

  if (error) {
    <Layout>
      <Box>{error.message}</Box>
    </Layout>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>error ocurred</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      {data?.post && (
        <Formik
          initialValues={{
            title: data?.post?.title || "",
            text: data?.post?.text || "",
          }}
          onSubmit={async (values) => {
            await updatePost({
              variables: { id: data?.post?.id || -1, ...values },
            });
            router.back();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                placeholder="Enter post title"
                label="Title"
                name="title"
              />
              <InputField
                mt={4}
                placeholder="Enter post text"
                label="Text"
                name="text"
                textarea
              />
              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                colorScheme="teal"
              >
                update post
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
