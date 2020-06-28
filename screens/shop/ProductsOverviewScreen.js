import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import ProductItem from "../../components/shop/ProductItem";

const ProductsOverviewScreen = (props) => {
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const renderProductItem = (itemData) => {
    return (
      <ProductItem
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        price={itemData.item.price}
        onViewDetail={() => {
          props.navigation.navigate("ProductDetail", {
            productId: itemData.item.id,
            productTitle: itemData.item.title,
          });
        }}
        onAddToCart={() => {}}
      />
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
