import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrormap";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface forgotPasswordProps {}

export const ForgotPassword: React.FC<forgotPasswordProps> = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  return (
    <Wrapper variant="small">
      <h1>Reset password</h1>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.email.length < 3 || !values.email.includes("@")) {
            setErrors(
              toErrorMap([{ field: "email", message: "invalid email" }])
            );
          } else {
            const response = await forgotPassword({
              email: values.email,
            });
            if (response.data?.forgotPassword) {
              setSent(true);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder="Enter your email"
              label="Email"
              name="email"
            />
            {sent && <Box color="green">Email successfully sent</Box>}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              send reset password link
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
