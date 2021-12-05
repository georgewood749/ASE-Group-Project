import React from "react";
import Navigator from "./screens/Navigator";
import { NativeBaseProvider } from "native-base";
import store from "./store/configureStore";
import { Provider } from "react-redux";

export default () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Navigator />
      </NativeBaseProvider>
    </Provider>
  );
};
