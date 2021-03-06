import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

import Card from "../UI/Card";
import Colors from "../../constants/Colors";

const ProductItem = (props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21)
    TouchableComponent = TouchableNativeFeedback;

  return (
    <Card style={styles.productContainer}>
      <View style={styles.touchableContainer}>
        <TouchableComponent onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actionsContainer}>{props.children}</View>
          </View>
        </TouchableComponent>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    height: 300,
    margin: 20,
  },
  touchableContainer: {
    overflow: "hidden",
    borderRadius: 10,
  },
  imageContainer: {
    width: "100%",
    height: "55%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: { alignItems: "center", height: "20%", padding: 10 },
  title: { fontSize: 18, marginVertical: 5, fontFamily: "open-sans-bold" },
  price: { fontSize: 14, color: Colors.grey, fontFamily: "open-sans" },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
});

export default ProductItem;
