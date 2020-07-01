import React, { useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import * as productsActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = "UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
  }
};

const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,

      // can't be changed so, the logic below is fine anyway
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!titleIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form", [
        { text: "OK" },
      ]);
      return;
    }

    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(prodId, title, description, imageUrl)
      );
    } else {
      dispatch(
        productsActions.createProduct(title, description, imageUrl, +price)
      );
    }
    props.navigation.goBack();
  }, [dispatch, prodId, title, description, imageUrl, price, titleIsValid]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const titleChangeHandler = (text) => {
    let isValidTitle = false;

    // check that text is empty or not
    if (text.trim().length === 0) {
      isValidTitle = true;
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValidTitle,

      // let the reducer knows which input trigger this
      // the "title" key should match the state, `inputValues` and `inputValidities`
      // inside the `useReducer()` function above.
      // because this will allow you to write some reducer code
      // which is highly reusable and highly flexible.
      // because we will transform this to be a funcion that actually works for all inputs
      input: "title",
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={titleChangeHandler}
            style={styles.input}
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onEndEditing={() => {}}
            onSubmitEditing={() => {}}
          />
          {!titleIsValid && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>ImageURL</Text>
          <TextInput
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            style={styles.input}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              value={price}
              onChangeText={(text) => setPrice(text)}
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>
        )}

        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const productId = navData.navigation.getParam("productId");
  const submitfn = navData.navigation.getParam("submit");
  return {
    headerTitle: productId ? "Edit Product" : "New Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-save" : "ios-save"
            // Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitfn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: { width: "100%" },
  label: { fontFamily: "open-sans-bold", marginVertical: 8 },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
});

export default EditProductScreen;
