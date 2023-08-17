import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {  GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {auth, db} from "./firebase"
import { COLORS, SIZES } from '../constants';
import { ref, set } from "firebase/database"
import BackButton from '../shared/BackButton';
// import * as GoogleSignIn from 'expo-google-sign-in';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [username, setUsername] = useState('')

  const navigation = useNavigation()
  
  
  
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '536751141225-3u7pjhftsqad67sh9usct4scpii33veb.apps.googleusercontent.com',
  //   });
  // }, []);
  

  // const handleGoogleSignIn = async () => {
  //   const provider = new GoogleAuthProvider();
  //   return signInWithPopup(auth, provider)
  // };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Profile")
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
  
        // Save the username to the database
        const currentUser = auth.currentUser;
        const userId = currentUser.uid;
        const reference = ref(db, 'users/' + userId +'/profile');
        set(reference, {
          username: username,
          email: email
        })
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  const togglePage = () => {
    setIsLoginPage(!isLoginPage)
    setEmail('')
    setPassword('')
  }

  return (
    <KeyboardAvoidingView
      style={styles.lcontainer}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <BackButton></BackButton>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.linput}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.linput}
          secureTextEntry
        />
        {!isLoginPage && (
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.linput}
          />
        )}
      </View>

      <View style={styles.lbuttonContainer}>
        {isLoginPage ? (
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.lbutton}
          >
            <Text style={styles.lbuttonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.lbutton}
          >
            <Text style={styles.lbuttonText}>Register</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={togglePage}
          // style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.lbuttonOutlineText}>
            {isLoginPage ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
          disabled={this.state.isSigninInProgress}
        />;
        
      </View>
          
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
export { auth };

const styles = StyleSheet.create({
  lcontainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    // width: '90%'
  },
  linput: {
    backgroundColor: 'lightgrey',
    paddingHorizontal: '7%',
    paddingVertical: '3%',
    width: SIZES.width*0.7,
    borderRadius: 20,
    marginVertical: SIZES.height*0.005,
    fontSize: SIZES.height*0.015,
  },
  lbuttonContainer: {
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.height*0.03,
  },
  lbutton: {
    backgroundColor: COLORS.lightblue,
    width: '100%',
    paddingHorizontal: SIZES.width*0.2,
    paddingVertical: SIZES.width*0.025,
    borderRadius: 20,
    alignItems: 'center',
  },
  lbuttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: COLORS.lightblue,
    borderWidth: 2,
  },
  lbuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: SIZES.height*0.02,
  },
  lbuttonOutlineText: {
    paddingTop: SIZES.height*0.01,
    color: COLORS.lightblue,
    fontSize: SIZES.height*0.014,
  },
})