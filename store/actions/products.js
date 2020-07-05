import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      // we can add any async code before dispatch a new action object.
      const response = await fetch(
        "https://rn-topshop.firebaseio.com/products.json"
      );

      // check response status before unpack
      if (!response.ok) {
        throw new Error("Error on fetching products!");
      }

      const resData = await response.json();

      // convert object to array
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  // Redux Thunk allows us to get a second argument
  // which give use access to Redux state
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-topshop.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Error on deleting a product.`);
    }

    dispatch({
      type: DELETE_PRODUCT,
      pid: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  // Redux Thunk allows us to get a second argument
  // which give use access to Redux state
  return async (dispatch, getState) => {
    // we can add any async code before dispatch a new action object.
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-topshop.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );

    const resData = await response.json();
    // console.log(resData); // returns product id

    // Redux Thunk will dispatch a new action object for you
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  // Redux Thunk allows us to get a second argument
  // which give use access to Redux state
  return async (dispatch, getState) => {
    // console.log(getState());
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-topshop.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error on updating a product.`);
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
