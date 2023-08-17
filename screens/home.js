import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {COLORS, SIZES} from '../constants';
import { ref, onValue} from "firebase/database";
import {auth, db} from "./firebase";


let activities = [
  {
    title: "Let's Start With a Moodbooster!",
    image: require('../assets/Home_Img/home-moodbooster.jpg'),
    subTitle:
      'Check in with yourself for 5 minutes',
    field: 'Moodbooster',
  },
  {
    title: 'Find a Support Group',
    image: require('../assets/Home_Img/home-findsupport.jpeg'),
    subTitle:
      'Join a community to get peer support',
    field: () => Linking.openURL('https://rainbows.org/find-support/'),
  },
  {
    title: 'Explore Rainbow Resources',
    image: require('../assets/Home_Img/home-resources.jpeg'),
    subTitle:
      'Answer your questions in an instant',
    field: 'Resources',
  },
  
];

const Home = ({ navigation }) => {
  console.log(auth)
  const [greeting, setGreeting] = useState('Welcome!');

  //Dynamic Greeting
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const reference = ref(db, 'users/' + userId + '/profile');
  
        onValue(reference, (snapshot) => {
          const data = snapshot.val();
          setGreeting(` Welcome, ${data.username}!`);
        });
      } else {
        setGreeting(' Welcome!');
      }
    });
  
    return unsubscribe;
  }, []);


  const ActivityItem = ({activity}) => {
    
    const handlePress = () => {
      if (typeof activity.field === 'function') {
        activity.field();
      } else {
        navigation.navigate(activity.field);
      }
    }
    return (
      <View>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.black,
            width: SIZES.width-50,
            margin: 20,
            height: 180,
            borderRadius: 10,
            padding: 0,
            shadowColor: '#9e9898',
            elevation: 5,
          }}>
          <Image
            source={activity.image}
            style={{
              width: '100%',
              resizeMode: 'cover',
              flex: 1,
              borderRadius: 15,
            }}
          />
        </TouchableOpacity>
        <Text
            style={{
              marginLeft: 30,
              textAlign: 'left',
              fontSize: SIZES.heading_font,
              fontWeight: 'bold',
              color: COLORS.darkblue
            }}>
            {activity.title}
          </Text>
          <Text style={{
            marginTop: 5,
            marginLeft: 30,
            marginBottom: 10,
            textAlign: 'left',
            fontSize: SIZES.subheading_font,
            color: COLORS.darkblue,
            }}>
            {activity.subTitle}
          </Text>
      </View>
    );
  };

  const Banner = () => {
    return (
      <View style= {{
        backgroundColor: COLORS.paleblue,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style= {{
          flex: 3,
          color: COLORS.darkblue,
          fontSize: 10,
          marginLeft: 5,
          marginRight: 0,
          textAlign: 'left',
        }}>
          If you are considering self-harm, don’t continue to use this app. Instead, please call this number.
        </Text>

        <Text style= {{
          flex: 1,
          color: COLORS.white,
          fontSize: 25,
          fontWeight: 'bold',
          marginLeft: 0,
          marginRight: 10,
          textAlign: 'right',
        }}>
          988
        </Text>

      </View>
    )
  }

  const MyFlatList = ({ activities }) => {
    const renderItem = ({ item }) => <ActivityItem activity={item} />;
  
    return (
      <View style = {{flex: 1, backgroundColor: "white"}}>
        <FlatList
          data={activities}
        
          ListHeaderComponent={
          <> 
              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: "white", marginTop: 20}}>
                <Image
                  source={require('../assets/RAC_Logo/RAC_Logo.png')}
                  style={{ width: 240, height: 60, alignSelf: 'center' }}
                />
              </View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 45,
              marginTop: 20,
              marginLeft: 20,
              color: COLORS.darkblue,
              }}>
              {greeting}
            </Text>
          </>}
          keyExtractor={item => item.title}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={Banner}
          />
      </View>
    );
  };
  
  
  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
        <View style={{
          backgroundColor: COLORS.white,

        }}>
          {/* <Image
                source={require('../assets/RAC_Logo.png')}
                style={{ width: 200, height: 50 }}
              /> */}
        </View>
        

          <MyFlatList activities={activities} />
        
        
        
      
    </SafeAreaView>
  );
};

export default Home;