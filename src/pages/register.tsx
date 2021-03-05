import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

const RegisterGQL = `mutation register($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    user {
      id
      username
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}`;

export const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(RegisterGQL);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values) => {
          const response = await register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder="Enter your username"
              label="Username"
              name="username"
            />
            <InputField
              placeholder="Enter your password"
              label="Password"
              name="password"
            />
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
