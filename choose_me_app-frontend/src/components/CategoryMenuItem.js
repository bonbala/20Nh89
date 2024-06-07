import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Colors, Fonts, Images} from '../contants';

const CategoryMenuItem = ({_id,category}) => {
  return (
    <TouchableOpacity style={styles.category}>
          <Text style={styles.categoryText}>
            {category}
          </Text> 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    marginTop: 0,    
    paddingLeft:4,
    overflow: 'hidden', // Ensures text does not overflow the rounded corners
  },
  categoryText: {
    fontSize: 15,
    lineHeight: 15 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.PEACH,
    marginTop: 0,
    borderRadius: 15,
    padding: 4,
    paddingBottom:4,  
    backgroundColor: Colors.DEFAULT_WHITE,
  },
});

export default CategoryMenuItem;
