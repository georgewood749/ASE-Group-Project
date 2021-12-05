import { useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import NetInfo from "@react-native-community/netinfo";

export default () => {
  const [isConnected, setConnection] = useImmer(false);
  const [isLoading, setLoading] = useImmer(true);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      ({ isConnected, isInternetReachable }) => {
         setConnection(isConnected && isInternetReachable);
         setLoading(false);
      }
    );

    return () => unsubscribe();
  });



  return [isConnected, isLoading];
};
