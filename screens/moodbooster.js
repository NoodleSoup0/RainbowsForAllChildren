import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SIZES } from '../constants';
import BackButton from '../shared/BackButton';
import { useNavigation } from '@react-navigation/native';

const Moodbooster = () => {
  const navigation = useNavigation();

  // Control Trail Progress
  const [currentTrail, setCurrentTrail] = useState(1);
  // Control Which Exercise to Display
  const [currentExercise, setCurrentExercise] = useState(0);

  const ActiveDashed = require('../assets/DashedBlueLine.png');
  const InactiveDashed = require('../assets/DashedGrayLine.png');

  const handleTrailPress = (exerciseNumber) => {
    // exercise Number: 2,3,4
    setCurrentTrail(exerciseNumber);
    setCurrentExercise(exerciseNumber-1);

     // Navigate to the appropriate screen based on exerciseNumber
      switch (exerciseNumber) {
        case 2:
          navigation.navigate('Breath');
          break;
        case 3:
          navigation.navigate('PickActive');
          break;
        case 4:
          navigation.navigate('PickMove');
          break;
        default:
          break;
      }
    
  };

  const handleExercisePress = () => {
    
    handleExercisePress(2)
  };

  return (
    <View style={styles.container}>
    
      <View>

        {/* Back Button Group */}
        <View style = {{backgroundColor: "white", paddingTop: 10, paddingLeft: 10}}>
          <BackButton></BackButton>
        </View>

      
        {/* PROGRESS TRAIL AND EXERCISES GROUP */}
        <View style = {{
          flexDirection: 'row', 
          height:450, 
          alignItems: 'center', 
          justifyContent: "center", 
          marginTop: SIZES.height*0.1, 
          left: SIZES.width/13
          }}>
          {/* PROGRESS TRAIL */}
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressCircle,
                currentTrail >= 1 && styles.progressCircleActive,
              ]}
            />
            <View style={{ flex:15}}>
              {currentTrail >= 2 ? (
                <Image source={ActiveDashed} style={{ flex: 1, resizeMode: 'contain', width: '90%', height: '50%' }} />
              ):(
                <Image source={InactiveDashed} style={{ flex: 1, resizeMode: 'contain', width: '90%', height: '50%' }} />
              )}
            </View>
            <View 
              style={[
                styles.progressCircle,
                currentTrail >= 2 && styles.progressCircleActive,
              ]}
            />
            <View style={{ flex:15}}>
              {currentTrail >= 3 ? (
                <Image source={ActiveDashed} style={{ flex: 1, resizeMode: 'contain', width: '90%', height: '50%' }} />
              ):(
                <Image source={InactiveDashed} style={{ flex: 1, resizeMode: 'contain', width: '90%', height: '50%' }} />
              )}
            </View>
            <View 
              style={[
                styles.progressCircle,
                currentTrail >= 3 && styles.progressCircleActive,
              ]}
            />
           
          </View>

          <View style={styles.exerciseContainer}>

            {/* Exercise 1 */}
            <TouchableOpacity
              onPress={() => handleTrailPress(2)}
              style={[
                styles.exerciseBox,
                currentExercise === 2 && styles.activeExerciseBox,
              ]}>
              <View style={{ flex: 3 }}>
                <Text style={{ color: COLORS.darkblue, fontSize: 19, fontWeight: '700' }}>Let's Breath!</Text>
                <Text style={{ color: COLORS.darkblue, fontSize: 10, fontWeight: '700' }}>Take 2 minutes to breath with this mindful exercise</Text>
              </View>
              <View style={{ width: SIZES.width * 0.80, height: 90, alignItems: 'center', flex: 1, marginHorizontal: 20 }}>
                <Image source={require('../assets/Cloud/CloudDark.png')} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>

            <View style= {styles.SPACEBETWEEN}/>
            
            {/* Exercise 2 */}
            <TouchableOpacity
              onPress={() => handleTrailPress(3)}

              style={[
                styles.exerciseBox,
                currentExercise === 3 && styles.activeExerciseBox,
              ]}>
              <View style={{ flex: 3 }}>
                <Text style={{ color: COLORS.darkblue, fontSize: 19, fontWeight: '700' }}>Let's Be Creative!</Text>
                <Text style={{ color: COLORS.darkblue, fontSize: 10, fontWeight: '700' }}>Activity!</Text>
              </View>
              <View style={{ width: SIZES.width * 0.80, height: 90, alignItems: 'center', flex: 1, marginHorizontal: 20 }}>
                <Image source={require('../assets/FunIcons/Lightbulb.png')} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>

            <View style= {styles.SPACEBETWEEN}/>
            {/* Exercise 3 */}
            <TouchableOpacity
              onPress={() => handleTrailPress(4)}
              style={[
                styles.exerciseBox,
                currentExercise === 4 && styles.activeExerciseBox,
              ]}>
              <View style={{ flex: 3 }}>
                <Text style={{ color: COLORS.darkblue, fontSize: 19, fontWeight: '700' }}>Let's Move!</Text>
                <Text style={{ color: COLORS.darkblue, fontSize: 10, fontWeight: '700' }}>Try these quick movement activities!</Text>
              </View>
              <View style={{ width: SIZES.width * 0.80, height: 90, alignItems: 'center', flex: 1, marginHorizontal: 20 }}>
                <Image source={require('../assets/FunIcons/Rainbow.png')} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
    </View> 
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: 'white'
  },
  SPACEBETWEEN: {
    height: 80,
  },
  progressContainer: {
    marginRight: 20,
  },
  progressTrail: {
    width: 0,
    height: SIZES.height*0.22,
    marginLeft: 8,
    borderWidth: 4,
    borderStyle: 'dashed',  // Set the border style to dashed
    borderColor: 'lightgrey',  // Set the border color
    
  },
  progressTrailActive: {
    borderColor: COLORS.lightblue,
  },
  progressCircle: {
    flex:1,
    borderColor: "#C6C6C6",
    aspectRatio: 1,
    borderWidth: 2,  // Set a border width
    borderRadius: 10
  },
  progressCircleActive: {
    backgroundColor: COLORS.lightblue,
    borderColor: "black",
  },
  exerciseContainer: { 
    // backgroundColor: 'green',
    flex: 1
  },
  exerciseBox: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    width: SIZES.width * 0.80,
    // height: SIZES.height * 0.15, 
    elevation: 3, // Add elevation for shadow effect
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1, // Opacity of the shadow
    shadowRadius: 4, // Radius of the shadow
    
  },
  // activeExerciseBox: {
  //   backgroundColor: 'white',
  // },
  exerciseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  Returnbutton: {
    backgroundColor: COLORS.lightblue,
    padding: 10,
    borderRadius: 5,
    marginTop: 100,
  },
  ReturnbuttonText: {
    color: 'white',
    textAlign: 'center',
  },
  
});

export default Moodbooster;
