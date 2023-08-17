import React, {useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Home from '../screens/home';
import ProfileScreen from '../screens/profile';
import Journal from '../screens/journal';
import Entries from '../screens/entries';
import Resources from '../screens/resources';
import Moodbooster from '../screens/moodbooster';
import EditEntryScreen from '../screens/EditEntryScreen';
import Breath from '../screens/Moodbooster Exercises/Breath';
import PickActive from '../screens/Moodbooster Exercises/PickActive';
import PickMove from '../screens/Moodbooster Exercises/PickMove';
import LoginScreen from '../screens/loginScreen';
import { COLORS, SIZES } from '../constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const tabColors = ['red', 'green', 'blue']; // Define an array of different background colors for each tab

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Journal') {
          iconName = 'book';
        } else if (route.name === 'Profile') {
          iconName = 'profile';
        }

        const [isPressed, setIsPressed] = useState(false);

        const handlePressIn = () => {
          setIsPressed(true);
        };

        const handlePressOut = () => {
          setIsPressed(false);
          onPress(); // Invoke the original onPress function
        };

        const tabStyle = {
          ...styles.tabBarItem,
          ...(index > 0 && { borderLeftWidth: 2, borderColor: 'white', paddingHorizontal: 20 }),
          ...(isPressed && index > 0 && { opacity: 1 }), // Set opacity to 1 when pressed and index > 0
          ...(iconName === 'home' && { paddingHorizontal: 20 }),
        };

        return (
          <TouchableOpacity
            style={tabStyle}
            onPress={handlePressOut} // Use handlePressOut instead of onPress
            onPressIn={handlePressIn} // Set the isPressed state to true when pressed
            key={index}
          >
            <AntDesign
              name={iconName}
              style={{ fontSize: 25, opacity: isFocused ? 1 : 0.8 }}
              color={isFocused ? COLORS.lightblue : 'white'}
            />
          </TouchableOpacity>
        );

      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Journal" component={Journal} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Journal" component={Journal} />
      <Stack.Screen name="Entries" component={Entries} options={{ headerTitle: '' }} />
      <Stack.Screen name="Resources" component={Resources} />
      <Stack.Screen name="Moodbooster" component={Moodbooster} />
      <Stack.Screen name="PickActive" component={PickActive} />
      <Stack.Screen name="Breath" component={Breath} />
      <Stack.Screen name="PickMove" component={PickMove} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EditEntryScreen" component={EditEntryScreen} options={{ headerTitle: '' }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkblue,
    height: 50,
    paddingVertical: 10,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
});

export default AppNavigator;
