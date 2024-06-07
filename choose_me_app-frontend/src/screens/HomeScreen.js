import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  CategoryMenuItem,
  HomeFoodCard,
  Separator,
} from '../components';
import { Colors, Fonts } from '../contants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FoodService } from '../services';
import { CategoryService } from '../services';
import { Display } from '../utils';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const sortStyle = isActive =>
  isActive
    ? styles.sortListItem
    : { ...styles.sortListItem, borderBottomColor: Colors.DEFAULT_WHITE };

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState();
  const [foods, setFoods] = useState(null);
  const [categories, setCategories] = useState(null);
  const [activeSortItem, setActiveSortItem] = useState('recent');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [errorMessage, setErrorMessage] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const HERE_API_KEY = 'N1VJJkJ75nlrnW3wBWj2iLlQadWYpHRo990Ur6r_yME'; // Replace with your actual HERE API key

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
              message: "This app needs to access your location",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
            setPermissionGranted(true);
            getCurrentLocation();
          } else {
            console.log("Location permission denied");
            setPermissionGranted(false);
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // For iOS or other platforms
        Geolocation.requestAuthorization();
        setPermissionGranted(true);
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          fetchAddress(position.coords.latitude, position.coords.longitude);
          setErrorMessage(null);
        },
        error => {
          console.error(error);
          setErrorMessage(error.message);
        },
        { enableHighAccuracy: true, timeout: 55000, maximumAge: 50000 }
      );
    };

    const fetchAddress = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode`, {
          params: {
            at: `${latitude},${longitude}`,
            apiKey: HERE_API_KEY
          }
        });
        if (response.data && response.data.items && response.data.items.length > 0) {
          setAddress(truncate(response.data.items[0].address.label, 10));
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error(error);
        setAddress("Error fetching address");
      }
    };

    requestLocationPermission();
  }, []);

  const truncate = (input) => input.length > 30 ? `${input.substring(0, 30)}...` : input;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      FoodService.getAllFoods().then(response => {
        if (response?.status) {
          setFoods(response?.data);
        }
      });
      CategoryService.getAllCategories().then(response => {
        if (response?.status) {
          setCategories(response?.data);
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.DEFAULT_WHITE}
        translucent
      />

      <Separator height={StatusBar.currentHeight} />

      <View style={styles.backgroundCurvedContainer} />

      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Ionicons
              name="search-outline"
              size={25}
              color={Colors.DEFAULT_GREY}
            />
            <Text style={styles.searchText}>Search..</Text>
          </View>

          <Feather
            name="sliders"
            size={20}
            color={Colors.DEFAULT_YELLOW}
            style={{ marginRight: 10 }}
          />
        </View>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors.DEFAULT_WHITE}
          />
          <Text style={styles.locationText}>Delivered to</Text>
          <Text style={styles.selectedLocationText}>{address}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={Colors.DEFAULT_BLACK}
          />
        </View>
        <View style={styles.categoriesContainer}>
          {/* <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categories}
            ListHeaderComponent={() => <Separator height={20} />}
            ListFooterComponent={() => <Separator height={20} />}
            ItemSeparatorComponent={() => <Separator height={10} />}
            renderItem={({ item }) => (
              <CategoryMenuItem
                {...item}
              />
            )}
          /> */}
        </View>
      </View>
          
      <View style={styles.horizontalListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={foods}
          keyExtractor={item => item?._id}
          ListHeaderComponent={() => <Separator height={20} />}
          ListFooterComponent={() => <Separator height={20} />}
          ItemSeparatorComponent={() => <Separator height={10} />}
          renderItem={({ item }) => (
            <HomeFoodCard
              {...item}
              navigate={() =>
                navigation.navigate('Restaurant', { restaurantId: item?.restaurantId })
              }
            />
          )}
        />
      </View>
      <Separator height={Display.setHeight(5)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GREY3,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.PEACH,
    height: 1927,
    position: 'absolute',
    top: -1 * (2000 - 230),
    width: 2000,
    alignSelf: 'center',
    zIndex: -1,
  },
  headerContainer: {
    justifyContent: 'space-evenly',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  locationText: {
    color: Colors.DEFAULT_WHITE,
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  selectedLocationText: {
    color: Colors.DEFAULT_BLACK,
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  alertBadge: {
    borderRadius: 32,
    backgroundColor: Colors.DEFAULT_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
    width: 16,
    position: 'absolute',
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 10,
    lineHeight: 10 * 1.4,
    fontFamily: Fonts.POPPINS_BOLD,
  },
  searchContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    height: 45,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchText: {
    color: Colors.DEFAULT_GREY,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  listContainer: {
    paddingVertical: 5,
    zIndex: -5,
  },
  horizontalListContainer: {
    marginTop: 20,
    marginLeft: '5%',
    marginBottom: 190,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  listHeaderTitle: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  listHeaderSubtitle: {
    color: Colors.DEFAULT_YELLOW,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  sortListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.DEFAULT_WHITE,
    marginTop: 8,
    elevation: 1,
  },
  sortListItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.DEFAULT_YELLOW,
    height: 40,
  },
  sortListItemText: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
});

export default HomeScreen;