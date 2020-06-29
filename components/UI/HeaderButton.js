import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      // forward all the props from a parent
      {...props}
      // expecting a vector icon
      IconComponent={Ionicons}
      // icon styling
      iconSize={23}
      color={Platform.OS === "android" ? Colors.light : Colors.primary}
    />
  );
};

export default CustomHeaderButton;
