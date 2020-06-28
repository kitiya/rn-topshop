import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
// import { useSelector } from "react-redux";

const ProductsOverviewScreen = (props) => {
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const renderProductItem = (itemData) => {
    return (
      <View>
        <Text>{itemData.item.title}</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        keyExtractor={(item) => item.id} // older version only
        data={availableProducts}
        renderItem={renderProductItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
