import { Center, Alert, VStack, Text, Box } from "native-base";

export default () => {
  return (
    <Center flex={1} px="3">
      <Alert w="100%" status="warning">
        <VStack space={1} flexShrink={1} w="100%" alignItems="center">
          <Alert.Icon size="md" />
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{
              color: "coolGray.800",
            }}
          >
            Internet connection unavailable
          </Text>

          <Box
            _text={{
              textAlign: "center",
            }}
            _dark={{
              _text: {
                color: "coolGray.600",
              },
            }}
          >
            Please check your internet connection and try again.
          </Box>
        </VStack>
      </Alert>
    </Center>
  );
};
