import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
  Button,
  Touchable,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/core'
import { COLORS, SIZES } from '../constants';
import { ref, set } from "firebase/database"
import { db, auth } from "./firebase"
import DataAPIPrompt from "../FetchData/FetchDataPrompt";
import { useIsFocused } from '@react-navigation/native';


export function writeUserData(prompt, content) {
  

  const currentUser = auth.currentUser;
  const currentDate = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true 
  };
  const formattedDate = currentDate.toLocaleString('en-US', options);
  const reference = ref(db, 'users/' + currentUser.uid + '/journal_entries/' + currentDate.getTime());
  set(reference, {
    date: formattedDate,
    prompt: prompt,
    content: content
  })
  .then(() => {
    console.log("Data successfully written to the database");
  })
  .catch((error) => {
    console.error("Error writing data to the database: ", error);
  });
}

export default function Journal() {
  const navigation = useNavigation()
  const Notebook = require('../assets/JournalPencil.png');

  const RainbowImage = () => {
    return (
      <ImageBackground
        source={require('../assets/FunIcons/Rainbow.png')}
        style={styles.successImage}
        resizeMode='contain'>

        <Image
        source={require('../assets/Cloud/CloudDark.png')}
        style={{
          marginLeft: -90,
          marginTop: 170,
        }}>
        </Image>
        <Image 
        source={require('../assets/Cloud/CloudDark.png')}
        style={{
          marginLeft: 200,
          marginTop: -140,
        }}>
        </Image>
      </ImageBackground>
    )
  }

  const [prompts, setPrompts] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [user, setUser] = useState(null);
  const [inThird, setInThird] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const Overlay = () => {
    return <View style={styles.overlay} />;
  };
  
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleSkip = () => {
    setShowModal(false);
    setShowSecondModal(true);
  };

  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
  };

  //Watch for change in login state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
    })

    return unsubscribe
  }, [])

  //Watch for changes in API data
  useEffect(() => {
    let fetchData = async () => {
      setPrompts(await DataAPIPrompt());
    };
    fetchData();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (!inThird){
        setSelectedEmotion('');
        setJournalEntry('');
        setShowSuccess(false);
        setShowMessage(false);
      }
    }
  }, [isFocused]);


  if (prompts.length == 0) {
    return (
      <ActivityIndicator
        size="large"
        animating={true}
        color="rgba(137,232,207,100)"
      />
    );
  }

  const uniqueMoods = [...new Set(prompts.map((item) => item[0]))];

  const selectEmotion = (emotion) => {
    setSelectedEmotion(emotion);
  };

  
  const saveJournalEntry = () => {
    if (user) { // If the user is logged in
      writeUserData(selectedPrompt, journalEntry);
      setJournalEntry('');
      setShowSuccess(true);
      setInThird(false);
    } else { // If the user is not logged in
      setShowModal(true); // Show the modal
    }
  };

  const renderMoods = () => {
    return uniqueMoods.map((mood, index) => (
      <TouchableOpacity 
        key={index} 
        style={styles.emotionButton}
        onPress={() => {
          selectEmotion(mood);
          setShowMessage(true);
          
        }}
      >
        <ImageBackground
          source={require('../assets/Cloud/CloudGray.png')}
          style={styles.emotionButtonImage}
          resizeMode='contain'>
          <Text
            style={styles.emotionButtonText}>{mood}</Text>
        </ImageBackground>
      </TouchableOpacity>
    ));
  };

  


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

          {selectedEmotion === '' && !showSuccess && !showMessage && (
            // First part - emotion selection
            <View>
              <Text style={styles.header}>How are you feeling today?</Text>
              <View style={styles.emotionSection}>
                {renderMoods()}
              </View>
            </View>
          )}
      
          {showMessage && (
            // Second part - Instruction Message
            <View style={styles.messageSection}>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setShowMessage(false);
                  setShowSuccess(false);
                  setSelectedEmotion('');
                }}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.instructionBox}>
                <View style = {{paddingLeft: 20}}>
                  <Image source={Notebook} style={{ width: SIZES.width * 0.25, 
                  height: SIZES.width * 0.25, 
                  resizeMode: 'contain'}} />
                </View>
                <Text style={styles.instructionMessage}>
                  Journaling can be a great way to track your growth, reduce stress, and find inspiration. Take a few minutes to try it now.
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.startJournalButton}
                onPress={() => {
                  setShowMessage(false)
                  console.log("2nd part: ", selectedEmotion)

                  // Filter prompts by selected mood
                  const filteredPrompts = selectedEmotion
                    ? prompts.filter((prompt) => prompt[0].toLowerCase() === selectedEmotion.toLowerCase())
                    : prompts;
                    
                  console.log("selectedEmotion: ", selectedEmotion)
                  console.log("filteredPrompts: ", filteredPrompts)
                  // Get a random prompt from the filtered prompts array
                  const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
                  const randomPrompt = filteredPrompts[randomIndex][1];
                  setSelectedPrompt(randomPrompt);
                  console.log("selectedPrompt: ", selectedPrompt)
                  setInThird(true);
                }}
              >
                <Text style={styles.startJournalButtonText}>Start Journaling!</Text>
              </TouchableOpacity>
            </View>
            )}

          {selectedEmotion !== '' && !showSuccess && !showMessage && (
            // Third part - journal entry

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.journalingSection}>

                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => {
                    setShowMessage(true);
                    setShowSuccess(false);
                  }}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <View style = {{width: SIZES.width*0.9}}>
                  <Text style={styles.header}>{ selectedPrompt }</Text>
                </View>
                    
                    <TextInput
                      style={styles.journalInput}
                      placeholder={`Press to start journaling...`}
                      value={journalEntry}
                      numberOfLines={10}
                      onChangeText={(text) => setJournalEntry(text)}
                      multiline
                    />
                    <View style = {{marginVertical: 40}}>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveJournalEntry}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                    
              </View>
            </KeyboardAvoidingView>
          
          )}

          {showSuccess && (
          // Fourth part - success message and button to start a new entry
          <View >
            
            <View style = {{ flex: 4, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../assets/RainbowCloud.png')} style={{  resizeMode: 'contain' }} />
            </View>
           
            <View style = {{ height: 100, flex: 1, textAlign: 'center', marginHorizontal: SIZES.width*0.4 }}>
             
              <Text style={styles.successMessage}>You've Finished Your Daily Journal!</Text>
             
            </View>
            <View style = {{ flex: 2}}>
              <TouchableOpacity 
                style={styles.newEntryButton}
                onPress={() => {
                  setSelectedEmotion('');
                  setShowSuccess(false);
                  navigation.navigate('Home')
                }}
              >
                <Text style={styles.newEntryButtonText}>Go Back Home</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.newEntryButton}
                onPress={() => {
                  setSelectedEmotion('');
                  setShowSuccess(false);
                }}
              >
                <Text style={styles.newEntryButtonText}>Start A New Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        )}
        {/* Render the modal based on the value of `showModal` */}
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <Overlay />
            <View style={styles.modalContent}>
              
              <View style={{ alignItems: 'center', paddingLeft: 40, marginVertical: 20 }}>
                <Image source={Notebook} style={{ width: SIZES.width * 0.3, 
                  height: SIZES.width * 0.35, 
                  resizeMode: 'contain'}} />
              </View>
              <Text style={styles.modalText}>In order to save your journal entries, you need to sign up for an account. Would you like to sign up?</Text>
              <View>
                <TouchableOpacity
                  style={[styles.linkButton, {backgroundColor: COLORS.lightblue}]}
                  onPress={() => {
                    navigation.navigate('Login');
                    setShowModal(false);
                  }}
                >
                  <Text style={[styles.linkText, {color: 'white'}]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.linkButton, {backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.lightblue}]}
                  onPress={() => handleSkip()}
                >
                  <Text style={[styles.linkText, {color: COLORS.lightblue}]}>Skip</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </Modal>

        {/* Second Modal */}
        <Modal visible={showSecondModal} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <Overlay />
            <View style={{width: SIZES.width*0.7, height: SIZES.height*0.2, backgroundColor: "white", borderRadius:20}}>
              
              <View style = {{ flex:3, justifyContent: 'center', alignContent: 'center', paddingHorizontal: 20}}>
                <Text style={styles.modalText}>
                  Your entry will be here until the app is closed or you log in to save it
                </Text>
              </View>
              <View style = {{flex:1, justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={handleCloseSecondModal}>
                  <View style={[styles.closeContainer]}>
                    <Text style = {styles.closeText}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </Modal>
    
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  emotionSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  emotionButton: {
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  header: {
    color: COLORS.darkblue,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 12,
    textAlign: 'center'
    
  },
  emotionButtonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  emotionButtonText: {
    fontSize: 14,
    color: COLORS.darkblue,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 10,
    right: 15,
    bottom: 39,
  },
  journalingSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalInput: {
    height: SIZES.height*0.4,
    width: SIZES.width*0.9,
    borderWidth: 1,
    borderColor: COLORS.darkblue,
    borderRadius: 8,
    padding: 20,
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 20,
    // marginHorizontal: SIZES.width*0.2
  },
  saveButton: {
    backgroundColor: COLORS.lightblue,
    padding: 10,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newEntryButton: {
    backgroundColor: COLORS.lightblue,
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: SIZES.width*0.35,
    alignItems: 'center'
  },
  newEntryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    color: COLORS.darkblue,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  messageSection: {
    alignItems: 'center', // center the child components horizontally
    justifyContent: 'center', // center the child components vertically
    // height: SIZES.height * 0.7, // set the height to 70% of the screen height
  },
  instructionBox: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    width: SIZES.width * 0.75,
    alignItems: 'center', // center the child components horizontally
    justifyContent: 'center', // center the child components vertically
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  instructionMessage: {
    color: COLORS.darkblue,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30, // add some margin at the top of the text
  },
  startJournalButton: {
    backgroundColor: COLORS.lightblue,
    padding: 16,
    borderRadius: 20,
    marginTop: SIZES.height*0.08,
    justifyContent: 'center',
    alignContent: 'center',
    
  },
  startJournalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: SIZES.width*0.8,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    color: COLORS.darkblue,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  closeContainer: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    alignItems: 'center',
    
  },
  closeText: {
    fontSize: 16,
    color: COLORS.darkblue,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity and color as desired
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: SIZES.width*0.2,
    borderRadius: 30,
    marginBottom: 10,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 18,
    fontWeight: "bold"
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },

});