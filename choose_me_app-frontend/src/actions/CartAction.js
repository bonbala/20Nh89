import {CartService} from '../services';

const types = {
  GET_CART_ITEMS: 'GET_CART_ITEMS',
  SET_IS_LOADING: 'SET_IS_LOADING',
  GET_CART_RESTAURANT: 'GET_CART_RESTAURANT',
  GET_CART_ITEMS_BY_RESTAURANT: 'GET_CART_ITEMS_BY_RESTAURANT'
};

const addToCart = ({foodId, restaurantId}) => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.addToCart({foodId, restaurantId})
      .then(cartResponse => {
        dispatch({
          type: types.GET_CART_ITEMS,
          payload: cartResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};


const removeFromCart = ({foodId}) => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.removeFromCart({foodId})
      .then(cartResponse => {
        dispatch({
          type: types.GET_CART_ITEMS,
          payload: cartResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};

const getCartItems = () => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.getCartItems()
      .then(cartResponse => {
        dispatch({
          type: types.GET_CART_ITEMS,
          payload: cartResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};

//CartAction.js 
const getCartRestaurant = () => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.getCartRestaurant()
      .then(restaurantResponse => {
        dispatch({
          type: types.GET_CART_RESTAURANT,
          payload: restaurantResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};

const getCartItemsByRestaurant = (restaurantId) => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.getCartItemsByRestaurant(restaurantId)
      .then(cartResponse => {
        dispatch({
          type: types.GET_CART_ITEMS_BY_RESTAURANT,
          payload: cartResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};

export default {
  types,
  addToCart,
  removeFromCart,
  getCartItems,
  getCartRestaurant,
  getCartItemsByRestaurant,
};

