import { useState, useEffect, useMemo } from "react";
import { getAuthentication } from "../config/credentials";

export default () => {
  const [state, setState] = useState(false);

  const authState = useMemo(() => ({
    sign: () => {
      setState(true);
    },
    signOut: () => {
      setState(false);
    }
  }))

  useEffect(() => {
    (async () => {
      const isAuthenticated = await getAuthentication();
      setState(isAuthenticated);
    })();
  });

  return [state, authState];
};
