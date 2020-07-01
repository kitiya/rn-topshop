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
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      // if anyone of the `updatedValidities[key]` is invalid
      // the value of the `updatedFormIsValid` will be invalid
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }

  return state;
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
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form", [
        { text: "OK" },
      ]);
      return;
    }

    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productsActions.createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }
    props.navigation.goBack();
  }, [
    dispatch,
    prodId,
    formState.inputValues.title,
    formState.inputValues.description,
    formState.inputValues.imageUrl,
    formState.inputValues.price,
    formState.formIsValid,
  ]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isTextValid = false;

    // check that text is empty or not
    if (text.trim().length > 0) {
      isTextValid = true;
    }

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isTextValid,

      // let the reducer knows which input trigger this
      // the "inputIdentifier" key should match the state, `inputValues` and `inputValidities`
      // inside the `useReducer()` function above.
      // because this will allow you to write some reducer code
      // which is highly reusable and highly flexible.
      // because we will transform this to be a funcion that actually works for all inputs
      input: inputIdentifier,
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={formState.inputValues.title}
            // the 'title' argument has to match the key inside the `useReducer()` function
            // note that we don't have to bind "text" argument insid the `textChangeHandler()` function
            // because it will be forward automatically when we use the `onChangeText` prop
            onChangeText={textChangeHandler.bind(this, "title")}
            style={styles.input}
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onEndEditing={() => {}}
            onSubmitEditing={() => {}}
          />
          {!formState.inputValidities.title && (
            <Text>Please enter a valid title!</Text>
          )}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>ImageURL</Text>
          <TextInput
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, "imageUrl")}
            style={styles.input}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              value={formState.inputValues.price}
              onChangeText={textChangeHandler.bind(this, "price")}
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>
        )}

        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, "description")}
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
