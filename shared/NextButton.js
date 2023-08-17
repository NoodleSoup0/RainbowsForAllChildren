import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const NextButton = ({ screenName }) => {
  const navigation = useNavigation();

  const handleNextButton = () => {
    navigation.navigate(screenName);
  };

  return (
    <View style = {{width: SIZES.width*0.243, height: SIZES.height*0.1}}>
      <TouchableOpacity onPress={handleNextButton}>
      <Image source={require('../assets/Cloud/CloudIconButton.png')} style={styles.image} />
      <View style={styles.arrowContainer}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
      </View>
    </TouchableOpacity>
    </View>
    
  );
};

export default NextButton;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  arrowContainer: {
    position: 'absolute',
    top: 38,
    left: 45,
  },
});
