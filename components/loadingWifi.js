import React from "react";
import LottieView from "lottie-react-native";


/**
 * Component renders a lottieView with spooky ghost launch animation
 * returns LottieView
 */
export default () => {
    return <LottieView source={require("../assets/animation/infinity-loader.json")} autoPlay loop />;
};
