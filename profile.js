import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, Text, TouchableOpacity, View, Linking, SafeAreaView, ScrollView } from 'react-native'
import { COLORS, SIZES } from '../constants';
import { auth, db } from './firebase'
import { ref, onValue} from "firebase/database";
import LoginScreen  from './loginScreen';
import { SimpleLineIcons } from '@expo/vector-icons'; 



const ProfileScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const Logo = require('../assets/RAC_Logo/RAC_Dark_bg.png');

  const [greeting, setGreeting] = useState(null);

  //Dynamic Greeting
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const reference = ref(db, 'users/' + userId + '/profile');
  
        onValue(reference, (snapshot) => {
          const data = snapshot.val();
          setGreeting(data.username);
        });
      }
    });
  
    return unsubscribe;
  }, []);

  //Verify that a user is login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
    })
    return unsubscribe
  }, [])
  
  //Link to Rainsbow.org
  const handleLink = () => {
    Linking.openURL('https://rainbows.org');
  }

  // SignOut
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        // navigation.navigate("Login")
      })
      .catch(error => alert(error.message))
  }

  //Navigate to Entries
  const handleJournalArchives = () => {
    navigation.navigate('Entries')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {user ? (
          // if logged in
          <>
            <View style={{ flex: 2}}>
              {/* <View style={{backgroundColor: COLORS.darkblue, height: 50, margin: 0 }}></View> */}
              <Image source={require('../assets/Profile_Header.png')} style={{ width: SIZES.width, height: SIZES.height*0.25, resizeMode: 'stretch' }} />
            </View>

            {/* USERNAME */}
            <View style = {{ flex: 1 }}>
            <Text style = {styles.userText}>
              {greeting}
            </Text>
            </View>

              {/* Contain Flex Boxes */}
              <View style = {{width: SIZES.width*0.75, height: SIZES.height*0.5, flex: 5}}>
              <View style = {{ flex : 1 }}></View>
                {/* Journal Archives */}
                <View style = {{ flex : 2 }}>

                  {/* Journal Archives button */}
                  <TouchableOpacity
                    onPress={handleJournalArchives}
                    style={[styles.linkButton, {
                      backgroundColor: "white",
                      elevation: 3, // Add elevation for shadow effect
                      shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 1, // Opacity of the shadow
                      shadowRadius: 4, // Radius of the shadow
                      padding: 20
                    }]}>
                    <View style={{ flex: 3 }}>
                      <Text style={{ color: COLORS.darkblue, fontSize: 19, fontWeight: '700', marginBottom: 10, }}>My Journal Entries</Text>
                      <Text style={{ color: COLORS.darkblue, fontSize: 13, fontWeight: '500' }}>Look back at what you’ve written about each day!</Text>
                    </View>
                    <View style={{ width: SIZES.width * 0.80, height: 90, alignItems: 'center', flex: 1, marginHorizontal: 5 }}>
                      <Image source={require('../assets/JournalPencil.png')} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
                    </View>
                  </TouchableOpacity>

                </View>
              
                {/* Website Linked */}
                <View style = {{flex : 2}}>

                  <Text style = {styles.linkText}> Check out our website!</Text>
              
                  <TouchableOpacity
                    onPress={handleLink}
                  >
                    <View
                      style={styles.linkButton}
                    >
                      <Image
                        source={Logo}
                        style={{
                          width: SIZES.width * 0.75, // adjust the image size as needed
                          height: SIZES.height * 0.2,
                          resizeMode: 'contain',
                        }}
                      />
                      
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style = {{ height: SIZES.height*0.04 }}></View>

              {/* Logout button */}
              <TouchableOpacity
                onPress={handleSignOut}
                // style={[styles.buttonContainer]}
              >
                <View style = {{ flexDirection: 'row', marginTop: 40, marginBottom: 15 }}>
                  <View style={{marginRight: 10}}>
                    <SimpleLineIcons name="logout" size={24} color={COLORS.darkblue} />
                  </View>
                  
                  <Text style={styles.buttonText}>Logout</Text>
                  
                </View>
                
              </TouchableOpacity>

          </>
        ) : (
          // if not logged in
          // Login Button

          <LoginScreen />

        )}
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  userText: {
    color: COLORS.darkblue,
    fontSize: 40,
    fontWeight: 'bold',
   
  },
  buttonText: {
    color: COLORS.darkblue,
    fontWeight: '700',
    fontSize: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    // justifyContent: 'center'
  },
  linkText: {
    color: COLORS.darkblue,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center"
  },
  
  
})