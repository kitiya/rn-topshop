import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as cartActions from "../../store/actions/cart";
import ProductItem from "../../components/shop/ProductItem";

const ProductsOverviewScreen = (props) => {
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const dispatch = useDispatch();

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
        onAddToCart={() => {
          dispatch(cartActions.addToCart(itemData.item));
        }}
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
