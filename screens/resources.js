import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Linking, FlatList, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../constants';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BackButton from '../shared/BackButton';


export default function Resources() {
  // const CustomBackButton = () => {
  //   const navigation = useNavigation();
  //   const handleBackButton = () => {
  //     navigation.goBack();
  //   };

  //   return (
  //     <View>
  //     <TouchableOpacity style={styles.button} onPress={handleBackButton}>
  //       <Ionicons name="arrow-back" size={24} color="black" />
  //     </TouchableOpacity>
  //   </View>
  //   );
  // };

  
  let [pages] = useState([
    { title: 'Death', key: '1' },
    { title: 'Separation/Divorce', key: '2' },
    { title: 'Incarceration', key: '3' },
    { title: 'Deportation', key: '4' },
    { title: 'Military Deployment', key: '5' },
    { title: 'Significant Illness', key: '6' },
    { title: 'Community Crisis', key: '7' }
  ]);
  const handlePress = (item) => {
    let url;

    if (item.key === '1') {
      url = 'https://rainbows.org/resources/death/';
    } else if (item.key === '2') {
      url = 'https://rainbows.org/resources/divorce-separation/';
    } else if (item.key === '3') {
      url = 'https://rainbows.org/resources/incarceration/';
    } else if (item.key === '4') {
      url = 'https://rainbows.org/resources/deportation/';
    } else if (item.key === '5') {
      url = 'https://rainbows.org/resources/military-deployment/';
    } else if (item.key === '6') {
      url = 'https://rainbows.org/resources/chronic-illness/';
    } else if (item.key === '7') {
      url = 'https://rainbows.org/resources/community-crisis/';
    }

    if (url) {
      Linking.openURL(url);
    }
  };
  const PageItem = ({page}) => {
    return (
      
      <TouchableOpacity 
        onPress={() => handlePress(page)}
        style={{
            backgroundColor: COLORS.grey,
            width: SIZES.width-50,
            margin: 10,
            height: 70,
            borderRadius: 10,
            padding: 15,
            shadowColor: COLORS.black,
            shadowOffset: {width: 10, height: 10},
            shadowRadius: 10,
            elevation: 10,
          }}>

        <Text
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontSize: SIZES.heading_font,
            fontWeight: 'bold',
          }}>
          {page.title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      {/* <StatusBar
          backgroundColor={COLORS.accent + '30'}
          barStyle="dark-content"
          animated={true}
        /> */}

        <FlatList
          data={pages}
          ListHeaderComponent={
          <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SIZES.width}}>
            <View>
              <BackButton />
            </View>
            <Text style={{
              fontSize: SIZES.subheading_font,
              lineHeight: 45,
              textAlign: 'center',
              marginTop: 20,
              marginBottom: 20,
              color: COLORS.black,
              }}>
              Resources Description
            </Text>
            <View style = {{ padding: 30 }}></View>
            
          </View>
          
            </>}
          style={{
            paddingHorizontal: 20,
            marginTop: 10,
          }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={item => item.title}
          renderItem={({ item }) => <PageItem page={item}/>}
        />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});





