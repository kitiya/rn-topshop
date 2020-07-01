import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import CartItem from "../../components/shop/CartItem";
import Colors from "../../constants/Colors";

const CartScreen = (props) => {
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCardItems = [];

    // convert the cartItems object into an array
    for (const key in state.cart.items) {
      transformedCardItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }

    return transformedCardItems.sort((a, b) =>
      a.productTitle > b.productTitle ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          disabled={cartItems.length === 0}
          onPress={() => {
            dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
          }}
        />
      </View>
      <FlatList
        keyExtractor={(item) => item.productId}
        data={cartItems}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable={true}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: { margin: 20 },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    shadowColor: Colors.dark,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Colors.light,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: { color: Colors.primary },
});

export default CartScreen;
