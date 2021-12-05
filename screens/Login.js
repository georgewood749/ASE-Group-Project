import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_REQUESTED } from "../store/auth.saga";
import { RESET_ERROR } from "../store/auth";

import {
  Center,
  Heading,
  FormControl,
  WarningIcon,
  Stack,
  Input,
  Button,
  ScrollView,
  useToast,
} from "native-base";

export default () => {
  // for updating and re-rendering login page when -
  // (a) username is changed
  // (b) password is changed
  const [username, setUsername] = useImmer(undefined);
  const [password, setPassword] = useImmer(undefined);

  const dispatch = useDispatch();
  const toast = useToast();
  const message = useSelector((state) => state.auth.message);

  useEffect(() => {
    if (message) {
      toast.show({
        title: "Request failed!",
        status: "error",
        description: message,
      });
      // reset message.
      dispatch(RESET_ERROR());
    }
  }, [message]);

  const [error, setError] = useImmer({
    user: {
      message: undefined,
    },
    password: {
      message: undefined,
    },
  });

  const validatePassword = (value) => {
    try {
      if (!value) {
        setError((prev) => {
          prev.password.message = "Password cannot be empty";
        });
        return false;
      } else {
        setError((prev) => {
          prev.password.message = undefined;
        });
      }
    } catch (err) {
      console.log(err.message);
    }

    return true;
  };

  const validateUsername = (username) => {
    try {
      if (!username) {
        setError((prev) => {
          prev.user.message = "Username cannot be empty";
        });
        return false;
      } else {
        setError((prev) => {
          prev.user.message = undefined;
        });
      }
    } catch (err) {
      console.log(err.message);
    }

    return true;
  };

  const handleLogin = (username, password) => {
    if (validateUsername(username) && validatePassword(password)) {
      try {
        dispatch(
          LOGIN_REQUESTED({
            username,
            password,
          })
        );
      } catch (error) {
        // error occured with dispatch login failure access store to see details.
        console.log(error);
      }
    } else if (validateUsername(username) || validatePassword(password)) {
      return false;
    }
  };

  return (
    <ScrollView flex={1}>
      <Center flex={1} mt="1/3">
        <Heading textAlign="center">Welcome Back!</Heading>
        <Heading textAlign="center" fontSize="md" fontWeight="light" m={5}>
          Please enter your login details
        </Heading>
        <FormControl isRequired isInvalid={error.user.message}>
          <Stack mx="4" space={3}>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              type="text"
              placeholder="Username"
              size="lg"
              style={styles.input}
              onChangeText={(username) => setUsername(username)}
            />

            <FormControl.ErrorMessage leftIcon={<WarningIcon size="xs" />}>
              {error.user.message}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <FormControl isRequired isInvalid={error.password.message} mt={5}>
          <Stack mx="4" space={3}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              placeholder="Password"
              size="md"
              style={styles.input}
              onChangeText={(password) => {
                setPassword(password);
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningIcon size="xs" />}>
              {error.password.message}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <Button
          bg="#EAEAEA"
          variant="primary"
          mt={10}
          isLoading={message ? true : false }
          _text={styles.text}
          onPress={() => handleLogin(username, password)}
        >
          Sign in
        </Button>
      </Center>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    shadowColor: "#F2F2F2",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
