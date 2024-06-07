import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Fonts, Images } from '../contants';
import { FoodCard, Separator } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Display } from '../utils';
import { useSelector, useDispatch } from 'react-redux';
import { CartAction } from '../actions';
import UserService from '../services/UserService';
import OrderService from '../services/OrderService';

const CartScreen = ({ navigation, route: { params: { restaurantId } } }) => {

  const [visible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const hide = () => setVisible(false);

  const[username,setUsername]=useState()
  const dispatch = useDispatch();
  const cart = useSelector(state => state?.cartState?.cart);
  const cartItemsByRestaurant = useSelector(state => state?.cartState?.cartItemsByRestaurant);

  useEffect(() => {
    dispatch(CartAction.getCartItems());
    dispatch(CartAction.getCartRestaurant());
    if (restaurantId) {
      dispatch(CartAction.getCartItemsByRestaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(()=>{
    const getData = async () => {
      try { 
        let response = await UserService.getUserData();  
        let userData = response.data;
        setUsername(userData.data.name) 
      } catch (error) {
        return {
          status: false,
          message: `{error?.message}`,
        };
      }
    };
    getData()
  },[])

  console.log(username,restaurantId)

  const isPhoneNumber = async () => {
    setVisible(true);
    try {
      let response = await UserService.getUserData();
      let userData = response.data;
      if (userData.data.phone) {
        setPhoneNumber(userData.data.phone);
      } else {
        console.log('Phone number does not exist');
        return {
          status: false,
          message: 'Phone number does not exist',
        };
      }
    } catch (error) {
      return {
        status: false,
        message: `Error checking phone number: {error?.message}`,
      };
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await OrderService.createOrder({ username,restaurantId });
      console.log(response)
      if (response.status) {
        await OrderService.removeCartItems({ username,restaurantId });
        navigation.goBack();
      } else {
        Alert.alert("Order Error", response.message);
      }
    } catch (error) {
      console.error("Checkout Error: ", error);
      Alert.alert("Checkout Error", "There was an error processing your checkout. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.PEACH}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>
      {cartItemsByRestaurant?.cartItems?.length > 0 ? (
        <>
          <ScrollView>
            <View style={styles.foodList}>
              {cartItemsByRestaurant?.cartItems?.map(item => (
                <FoodCard
                  {...item?.food}
                  key={item?.food?._id}
                  navigate={() =>
                    navigation.navigate('Food', { foodId: item?._id })
                  }
                />
              ))}
            </View>
            <View style={styles.promoCodeContainer}>
              <View style={styles.rowAndCenter}>
                <Entypo name="ticket" size={30} color={Colors.DEFAULT_YELLOW} />
                <Text style={styles.promoCodeText}>Add Promo Code</Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={Colors.DEFAULT_BLACK}
              />
            </View>
            <View style={styles.amountContainer}>
              <View style={styles.amountSubContainer}>
                <Text style={styles.amountLabelText}>Item Total</Text>
                <Text style={styles.amountText}>
                   {cartItemsByRestaurant?.metaData?.itemsTotal?.toFixed(2)} đ
                </Text>
              </View>
              <View style={styles.amountSubContainer}>
                <Text style={styles.amountLabelText}>Discount</Text>
                <Text style={styles.amountText}>
                   {cartItemsByRestaurant?.metaData?.discount?.toFixed(2)} đ
                </Text>
              </View>
              <View style={styles.amountSubContainer}>
                <Text style={styles.amountLabelText}>Delivery Fee</Text>
                <Text
                  style={{ ...styles.amountText, color: Colors.DEFAULT_GREEN }}>
                  Free
                </Text>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>
                 {cartItemsByRestaurant?.metaData?.grandTotal?.toFixed(2)} đ
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <View style={styles.rowAndCenter}>
                <Ionicons
                  name="cart-outline"
                  color={Colors.DEFAULT_WHITE}
                  size={20}
                />
                <Text style={styles.checkoutText}>Checkout</Text>
              </View>
              <Text style={styles.checkoutText}>
                 {cartItemsByRestaurant?.metaData?.grandTotal?.toFixed(2)} đ
              </Text>
            </TouchableOpacity>
            <Separator height={Display.setHeight(9)} />
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image
            style={styles.emptyCartImage}
            source={Images.EMPTY_CART}
            resizeMode="contain"
          />
          <Text style={styles.emptyCartText}>Cart Empty</Text>
          <Text style={styles.emptyCartSubText}>
            Go ahead and order some tasty food
          </Text>
          <TouchableOpacity style={styles.addButtonEmpty}>
            <AntDesign name="plus" color={Colors.DEFAULT_WHITE} size={20} />
            <Text style={styles.addButtonEmptyText}>Add Food</Text>
          </TouchableOpacity>
          <Separator height={Display.setHeight(15)} />
        </View>
      )}
      {/* <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={hide}>
        <View style={styles.lower}>
          <View style={styles.modalContent}>
            {phoneNumber != null
              ? <Text style={{ fontSize: 12 }} onPress={hide}>HavePhoneNumber</Text>
              : <Text style={{ fontSize: 12 }} onPress={hide}>DontHavePhoneNumber</Text>
            }
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  upper: { height: 100, backgroundColor: '#DDD', opacity: .5 },
  lower: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: Display.setHeight(30),
    width: Display.setWidth(90)
  },
  hideText: {
    fontSize: 50,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.PEACH
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    width: Display.setWidth(80),
    textAlign: 'center',
  },
  foodList: {
    marginHorizontal: Display.setWidth(4),
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
  },
  promoCodeText: {
    fontSize: 15,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 15 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  amountContainer: {
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  amountSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  amountLabelText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  amountText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Display.setWidth(4),
    marginVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_BOLD,
    color: Colors.DEFAULT_BLACK,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Display.setWidth(4),
    backgroundColor: Colors.PEACH,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  checkoutText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  emptyCartImage: {
    height: Display.setHeight(20),
    width: Display.setWidth(50),
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    marginTop: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.INACTIVE_GREY,
    marginVertical: 10,
  },
  addButtonEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.DEFAULT_GREEN,
    padding: 10,
    borderRadius: 8,
  },
  addButtonEmptyText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_WHITE,
    marginLeft: 10,
  },
});

export default CartScreen;
