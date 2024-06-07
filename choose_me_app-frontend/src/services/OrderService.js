import {ApiContants} from '../contants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getOrders = async ({ username }) => {
  console.log('OrderService | getOrders');
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}`,
      {
        headers: authHeader(getToken()),
        params: { username } // Pass username as query parameter
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Order data fetched',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Order data not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Order data not found',
    };
  }
};

const createOrder = async ({ username, restaurantId }) => {
  console.log('OrderService | createOrder');
  try {
    let response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/${username}`,
      { restaurantId },
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Item order successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Item order failed',
      };
    }
  } catch (error) {
    console.log(error?.response);
    return {
      status: false,
      message: 'Item order failed',
    };
  }
};

const removeCartItems = async ({ username, restaurantId }) => {
  console.log('OrderService | removeCartItems');
  try {
    let response = await axios.delete(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}/${username}`,
      {
        headers: authHeader(getToken()),
        data: { restaurantId }, // Pass restaurantId as request body
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Item removed from cart successfully',
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Item removed from failed',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Item removed from failed',
    };
  }
};

export default { getOrders, createOrder, removeCartItems };
