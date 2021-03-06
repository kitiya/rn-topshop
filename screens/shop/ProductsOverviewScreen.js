import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import ProductItem from "../../components/shop/ProductItem";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(); // initial state is undefined
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const dispatch = useDispatch();

  // wrapping async inside a function
  // this is how we do it in the `useEffect()`
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    // setIsLoading(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
    // setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  // need this `useEffect()` for the initial rendering
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  // Drawer Navigation captures the screen and kept it in momory after the initially render
  // this `useEffect()` helps to rerender the screen whenever the screen is reentered
  // so, we can get updated data.
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", loadProducts);

    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const renderProductItem = (itemData) => {
    return (
      <ProductItem
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        price={itemData.item.price}
        onSelect={() => {
          selectItemHandler(itemData.item.id, itemData.item.title);
        }}
      >
        <Button
          color={Colors.primary}
          title="View Details"
          onPress={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        />
        <Button
          color={Colors.primary}
          title="To Cart"
          onPress={() => dispatch(cartActions.addToCart(itemData.item))}
        />
      </ProductItem>
    );
  };

  if (error) {
    console.log(error.message);
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && availableProducts.length == 0) {
    return (
      <View style={styles.centered}>
        <Text>Not products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      keyExtractor={(item) => item.id} // older version only
      data={availableProducts}
      renderItem={renderProductItem}
      onRefresh={loadProducts}
      refreshing={isRefreshing} // let React Native when you're done
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ProductsOverviewScreen;
