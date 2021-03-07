import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrormap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface changePasswordProps {
  token: string;
}

const ChangePassword: NextPage<changePasswordProps> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
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
              newPassword: values.password,
              token,
            });
            if (response.data?.changePassword?.errors) {
              const errorMap = toErrorMap(
                response.data.changePassword.errors
              );

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
            {tokenError && <Box color="red">{tokenError}</Box>}
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

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  ChangePassword as any
);
