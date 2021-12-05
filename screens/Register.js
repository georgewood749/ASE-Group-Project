import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { StyleSheet, LogBox } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SIGNUP_REQUESTED } from "../store/auth.saga";
import { RESET_ERROR } from "../store/auth";
import {
  useToast,
  Center,
  Heading,
  FormControl,
  WarningIcon,
  Stack,
  Input,
  Button,
  ScrollView,
} from "native-base";
import schema from "../config/validation";

export default () => {
  LogBox.ignoreLogs([
    'Warning: Each child in a list should have a unique "key" prop. See https://fb.me/react-warning-keys for more information.',
  ]);
  // for updating and re-rendering register page when -
  // (a) username is changed
  // (b) password is changed
  const [username, setUsername] = useImmer(undefined);
  const [password, setPassword] = useImmer(undefined);
  const [error, setError] = useImmer({
    user: {
      message: undefined,
    },
    password: {
      message: [],
    },
  });

  const toast = useToast();
  const message = useSelector((state) => state.auth.message);
  const dispatch = useDispatch();

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

  const validatePassword = (value) => {
    try {
      if (!value) {
        setError((prev) => {
          prev.password.message = [
            {
              id: `error_${1}`,
              message: "Password cannot be empty",
            },
          ];
        });
        return false;
      } else {
        // password validation.
        if (!schema.validate(value)) {
          setError((prev) => {
            const message = schema.validate(value, { details: true });
            prev.password.message = message.map((obj, index) => {
              return {
                id: `error_${index}`,
                ...obj,
              };
            });
          });

          return false;
        } else {
          setError((prev) => {
            prev.password.message = [];
          });
        }
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
      }

      if (username.length <= 5) {
        console.log(username.length);
        setError((prev) => {
          prev.user.message = "Username must be at least 6 characters long";
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
      dispatch(
        SIGNUP_REQUESTED({
          username,
          password,
        })
      );
    } else if (validateUsername(username) || validatePassword(password)) {
      return false;
    }
  };

  return (
    <ScrollView flex={1}>
      <Center flex={1} mt="1/3">
        <Heading textAlign="center">Register an account</Heading>
        <Heading textAlign="center" fontSize="md" fontWeight="light" m={5}>
          Please enter your username and password
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
            {error.user.message ? null : (
              <FormControl.HelperText>
                Must be at least 6 characters long
              </FormControl.HelperText>
            )}
            <FormControl.ErrorMessage leftIcon={<WarningIcon size="xs" />}>
              {error.user.message}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={error.password.message.length > 0}
          mt={5}
        >
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
            {error.password.message.length > 0 ? null : (
              <FormControl.HelperText>
                Must be at least 6 characters long, has uppercase, lowercase
                characters and at least one digit.
              </FormControl.HelperText>
            )}
            {error.password.message.map((error) => (
              <FormControl.ErrorMessage
                id={error.id}
                leftIcon={<WarningIcon size="xs" />}
              >
                {error.message}
              </FormControl.ErrorMessage>
            ))}
          </Stack>
        </FormControl>
        <Button
          bg="#EAEAEA"
          variant="primary"
          mt={10}
          isLoading={message ? true : false}
          _text={styles.text}
          onPress={() => handleLogin(username, password)}
        >
          Sign up
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
