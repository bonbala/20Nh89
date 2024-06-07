import {ApiContants} from '../contants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getAllCategories = async () => {
  console.log('CategoryService | getAllCategories');

  try {
    let categoryResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.CATEGORY}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (categoryResponse?.status === 200) {
      return {
        status: true,
        message: 'Category data fetched',
        data: categoryResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: 'Food data not found',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Food data not found',
    };
  }
};


export default {getAllCategories};
