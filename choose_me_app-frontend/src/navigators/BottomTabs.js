import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AccountScreen,
  BookmarkScreen,
  OrderScreen,
  HomeScreen,
} from '../screens';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Display } from '../utils';
import { Colors } from '../contants';
import USERICON from '../assets/SVG/USERICON';
import SELECTED_USERICON from '../assets/SVG/SELECTED_USERICON';
import SELECTED_BOOKMARKICON from '../assets/SVG/SELECTED_BOOKMARKICON';
import HOMEICON from '../assets/SVG/HOMEICON';
import SELECTED_HOMEICON from '../assets/SVG/SELECTED_HOMEICON';
import BOOKMARKICON from '../assets/SVG/BOOKMARKICON';
import SELECTED_CARTICON from '../assets/SVG/SELECTED_CARTICON';
import CARTICON from '../assets/SVG/CARTICON';

const BottomTabs = createBottomTabNavigator();
export default () => (
  <BottomTabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        height: Display.setHeight(8),
        backgroundColor: Colors.PEACH,
        borderTopWidth: 0,
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: Colors.DEFAULT_GREEN,
      tabBarInactiveTintColor: Colors.INACTIVE_GREY,
    }}
  >
    <BottomTabs.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          focused ? <SELECTED_HOMEICON/>:<HOMEICON/>
        ),
      }}
    />
    <BottomTabs.Screen
      name="Bookmark"
      component={BookmarkScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          focused ? <SELECTED_BOOKMARKICON/>:<BOOKMARKICON/>
        ),
      }}
    />
    <BottomTabs.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          focused ? <SELECTED_CARTICON/>:<CARTICON/>
        ),
      }}
    />
    <BottomTabs.Screen
      name="Account"
      component={AccountScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          focused ? <SELECTED_USERICON/> : <USERICON/>
        ),
      }}
    />
  </BottomTabs.Navigator>
);
