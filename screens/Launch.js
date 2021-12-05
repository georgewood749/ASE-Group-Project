import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { VStack, Heading, Button, Center } from "native-base";

/*
<View style={styles.container}>
      <Text style={styles.text}>ASE Group Project Task 3</Text>
      <View style={styles.buttonContainer}>
        <Button submit={() => navigation.navigate("Register")}>Sign up</Button>
        <Button submit={() => navigation.navigate("Login")}> Sign in</Button>
      </View>
</View>
*/

export default ({ navigation }) => {
  return (
    <Center flex={1}>
      <VStack safeArea>
        <Heading
          textAlign="center"
          width={246}
          height={114}
          fontStyle="normal"
          fontWeight="medium"
        >
          ASE Group Project Task 3
        </Heading>
        <Button
          size="lg"
          bg="#EAEAEA"
          variant="primary"
          mt={10}
          _text={styles.text}
          onPress={() => navigation.navigate("Register")}
        >
          Sign up
        </Button>
        <Button
          size="lg"
          bg="#EAEAEA"
          variant="primary"
          mt={10}
          _text={styles.text}
          onPress={() => navigation.navigate("Login")}
        >
          Sign in
        </Button>
      </VStack>
    </Center>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(0,0,0,1.00)",
  },
});
