import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EditProductScreen = (props) => {
  const id = props.navigation.getParam("productId");
  return (
    <View>
      <Text>EDIT {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EditProductScreen;
