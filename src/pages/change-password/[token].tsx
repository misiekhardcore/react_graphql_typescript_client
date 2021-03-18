import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrormap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: React.FC<{}> = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <h1>Reset password</h1>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.password !== values.confirmPassword) {
            setErrors(
              toErrorMap([
                {
                  field: "confirmPassword",
                  message: "passwords not match",
                },
              ])
            );
          } else {
            const response = await changePassword({
              variables: {
                newPassword: values.password,
                token:
                  typeof router.query.token === "string"
                    ? router.query.token
                    : "",
              },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.changePassword.user,
                  },
                });
              },
            });
            if (response.data?.changePassword?.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);

              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }

              setErrors(errorMap);
            } else if (response.data?.changePassword?.user) {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder="Enter your new password"
              label="New password"
              name="password"
              type="password"
            />
            <InputField
              placeholder="Confirm your new password"
              label="Repeat password"
              name="confirmPassword"
              type="password"
            />
            {tokenError && (
              <Flex>
                <Box color="red" mr={2}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>try again</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
