import PRODUCTS from "../../data/dummy-data";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((product) => product.ownerId === "u1"),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
