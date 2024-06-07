import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {Separator, ToggleButton} from '../components';
import {Colors, Fonts, Images} from '../contants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Display} from '../utils';
import {useDispatch} from 'react-redux';
import {StorageService} from '../services';
import {GeneralAction} from '../actions';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import UserService from '../services/UserService';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('Fetching address...');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState(null);
  const [categories, setCategories] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const HERE_API_KEY = 'N1VJJkJ75nlrnW3wBWj2iLlQadWYpHRo990Ur6r_yME';



  useEffect(()=>{
    const getData = async () => {
      try { 
        let response = await UserService.getUserData();  
        let userData = response.data;
        setUsername(userData.data.name) 
        setEmail(userData.data.email)
        setPhoneNumber(userData.data.phone) 
      } catch (error) {
        return {
          status: false,
          message: `${error?.message}`,
        };
      }
    };
    getData()
  },[]);

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
  

  return (
  <View style={styles.container}>
  <StatusBar
    barStyle="dark-content"
    backgroundColor={Colors.PEACH}
    translucent
  />
  <Separator height={StatusBar.currentHeight} />
  <View style={styles.backgroundCurvedContainer} />
  <View style={styles.headerContainer}>
    <Ionicons
      name="chevron-back-outline"
      size={24}
      color={Colors.DEFAULT_BLACK}
      onPress={() => {
        navigation.goBack();
      }}
    />
    <Text style={styles.headerText}>Profile</Text>
    <View>  
      <View>
      </View>
    </View>
  </View>
  <View style={styles.profileHeaderContainer}>
    <TouchableOpacity>
     <View style={styles.profileImageContainer}>
       <Image style={styles.profileImage} source={Images.AVATAR} />
     </View>
    </TouchableOpacity>
    
    <View style={styles.profileTextContainer}>
      <Text style={styles.nameText}>{username}</Text>
      <Text style={styles.emailText}>{email}</Text>
    </View>
  </View>
  <Separator height={70}/>
  <View style={styles.mainContainer}>
    <Text style={styles.sectionHeaderText}>My Account</Text>
    <TouchableOpacity onPress={()=>{navigation.navigate('Modify')}} style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color={Colors.PEACH}
        />
        <Separator width={5}/>
        <Text style={styles.sectionText}>{username}</Text>
      </View>
      <Feather
        name="edit-2"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Feather
          name="lock"
          size={24}
          color={Colors.PEACH}
        />
        <Text style={styles.sectionText}>Password</Text>
      </View>
      <Feather
        name="chevron-right"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Feather
          name="mail"
          size={24}
          color={Colors.PEACH}
        />
        <Text style={styles.sectionText}>{email}</Text>
      </View>
      <Feather
        name="chevron-right"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Feather
          name="phone"
          size={24}
          color={Colors.PEACH}
        />
        <Text style={styles.sectionText}>{phoneNumber? phoneNumber :'Phone Number'}</Text>
      </View>
      <Feather
        name="chevron-right"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Feather
          name="map-pin"
          size={24}
          color={Colors.PEACH}
        />
        <Text style={styles.sectionText}>{address? address : 'Address'}</Text>
      </View>
      <Feather
        name="chevron-right"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>

    <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
      <View style={styles.sectionTextContainer}>
        <Feather
          name="globe"
          size={24}
          color={Colors.PEACH}
        />
        <Text style={styles.sectionText}>Language-English</Text>
      </View>
      <Feather
        name="chevron-right"
        color={Colors.INACTIVE_GREY}
        size={24}
      />
    </TouchableOpacity>
    
    
  </View>
</View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.PEACH,
    height: 2400,
    position: 'absolute',
    top: -1 * (2400 - 230),
    width: 2400,
    borderRadius: 2400,
    alignSelf: 'center',
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 24 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  alertBadge: {
    backgroundColor: Colors.DEFAULT_YELLOW,
    position: 'absolute',
    height: 16,
    width: 16,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.POPPINS_BOLD,
    lineHeight: 10 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  profileHeaderContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImageContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    elevation: 3,
  },
  profileImage: {
    width: Display.setWidth(15),
    height: Display.setWidth(15),
    borderRadius: 32,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  emailText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
  },
  menuContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
  },
  menuIcon: {
    backgroundColor: Colors.LIGHT_GREEN,
    height: Display.setWidth(8),
    width: Display.setWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  menuText: {
    fontSize: 12,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 12 * 1.4,
    color: Colors.DEFAULT_BLACK,
    textAlign: 'center',
    marginTop: 5,
  },
  mainContainer: {
    marginHorizontal: 24,
    marginTop: 10,
    backgroundColor: Colors.DEFAULT_WHITE,
    elevation: 3,
    paddingHorizontal: 24,
    borderRadius: 10,
    paddingBottom: 24,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 16 * 1.4,
    color: Colors.DEFAULT_BLACK,
    marginTop: 25,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  sectionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 16 * 1.4,
    color: Colors.INACTIVE_GREY,
    marginLeft: 10,
  },
});

export default ProfileScreen