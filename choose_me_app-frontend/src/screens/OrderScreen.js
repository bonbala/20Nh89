import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { Colors, Fonts, Images } from '../contants';
import { Separator, BookmarkCard,RestaurantCart, } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';
import { CartService } from '../services';

const ListItemSeparator = () => (
  <View
    style={{
      height: 0.8,
      backgroundColor: Colors.DEFAULT_GREY,
      width: '100%',
      marginVertical: 10,
    }}
  />
);

const OrderScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      CartService.getCartRestaurant().then(response => {
        if (response?.status) {
          const uniqueRestaurants = getUniqueRestaurants(response?.data?.cartRestaurant);
          setRestaurants(uniqueRestaurants);
        }
      }).catch(error => {
        console.log('Error in CartService.getCartRestaurant:', error);
      });
    });
  
    return unsubscribe;
  }, [navigation]);
  console.log(restaurants)

  const getUniqueRestaurants = (cartItems) => {
    const restaurantMap = new Map(); // Sử dụng Map để lưu trữ các nhà hàng duy nhất
    cartItems.forEach(item => {
      if (item.restaurants) {
        const restaurantId = item.restaurants._id; // Sửa lại để lấy ID của nhà hàng
        if (!restaurantMap.has(restaurantId)) { // Kiểm tra xem nhà hàng đã tồn tại trong Map chưa
          restaurantMap.set(restaurantId, item.restaurants); // Thêm nhà hàng vào Map nếu chưa tồn tại
        }
      }
    });
    return Array.from(restaurantMap.values()); // Chuyển đổi Map thành mảng và trả về các giá trị duy nhất
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
        <Text style={styles.headerTitle}>My Order</Text>
      </View>
      <View>
      <FlatList
        style={styles.RestaurantCartList}
        data={restaurants}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <Separator height={10} />}
        ListFooterComponent={() => <Separator height={10} />}
        ItemSeparatorComponent={() => <ListItemSeparator />}
        renderItem={({ item }) => (
          <RestaurantCart
            {...item}
            navigate={() =>
            navigation.navigate('Cart', { restaurantId: item._id }) // Truyền restaurantId khi chuyển trang
            }   
          />
        )}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  upper: { height: 100, backgroundColor: '#DDD', opacity: 0.5 },
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
    color: 'white'
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
    marginLeft: 10,
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountContainer: {
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 20,
    borderBottomWidth: 0.5,
  },
  amountSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  amountLabelText: {
    fontSize: 15,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 15 * 1.4,
    color: Colors.DEFAULT_GREEN,
  },
  amountText: {
    fontSize: 15,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 15 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  totalContainer: {
    marginHorizontal: Display.setWidth(4),
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 20 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  checkoutButton: {
    flexDirection: 'row',
    width: Display.setWidth(80),
    backgroundColor: Colors.DEFAULT_GREEN,
    alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    height: Display.setHeight(7),
    marginTop: 10,
  },
  checkoutText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_WHITE,
    marginLeft: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 30,
    fontFamily: Fonts.POPPINS_LIGHT,
    lineHeight: 30 * 1.4,
    color: Colors.DEFAULT_GREEN,
  },
  emptyCartSubText: {
    fontSize: 12,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 12 * 1.4,
    color: Colors.INACTIVE_GREY,
  },
  addButtonEmpty: {
    flexDirection: 'row',
    backgroundColor: Colors.DEFAULT_YELLOW,
    borderRadius: 8,
    paddingHorizontal: Display.setWidth(4),
    paddingVertical: 5,
    marginTop: 10,
    justifyContent: 'space-evenly',
    elevation: 3,
    alignItems: 'center',
  },
  addButtonEmptyText: {
    fontSize: 12,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 12 * 1.4,
    color: Colors.DEFAULT_WHITE,
    marginLeft: 10,
  },
  emptyCartImage: {
    height: Display.setWidth(60),
    width: Display.setWidth(60),
  },
  RestaurantCartList:{
    marginHorizontal: 15,
  },
});

export default OrderScreen;
