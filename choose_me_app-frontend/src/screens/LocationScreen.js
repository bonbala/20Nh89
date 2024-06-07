import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Image, Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
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
          console.log(position)
          fetchAddress(position.coords.latitude, position.coords.longitude);
          setErrorMessage(null);
        },
        error => {
          console.error(error);
          setErrorMessage(error.message);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 50000 }
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
          setAddress(response.data.items[0].address.label);
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

  const retryLocation = () => {
    setErrorMessage(null);
    getCurrentLocation();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Location</Text>
      {permissionGranted ? (
        location ? (
          <View>
            <Text style={styles.locationText}>
              Latitude: {location.coords.latitude}{'\n'}
              Longitude: {location.coords.longitude}
            </Text>
            <Text style={styles.addressText}>
              Address: {address ? address : 'Fetching address...'}
            </Text>
          </View>
        ) : (
          errorMessage ? (
            <View>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Button title="Retry" onPress={retryLocation} />
            </View>
          ) : (
            <Text style={styles.loadingText}>Fetching location...</Text>
          )
        )
      ) : (
        <Text style={styles.errorText}>Location permission is required to display your current location.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  }
});

export default LocationScreen;
