import { FormControl } from "@chakra-ui/form-control";
import { FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

export const register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                value={values.username}
                onChange={handleChange}
                id="username"
                placeholder="Username"
              />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
