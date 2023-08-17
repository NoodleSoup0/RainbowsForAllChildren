import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { getDatabase, ref, set, get } from 'firebase/database';
import { db, auth } from "./firebase"
import { COLORS, SIZES } from '../constants';

function EditEntryScreen({ route, navigation }) {
  const { entry } = route.params;
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Retrieve the diary entry data from the database
    const database = getDatabase();
    const currentUser = auth.currentUser;
    const reference = ref(database, 'users/' + currentUser.uid + '/journal_entries/' + entry.key);
    get(reference).then((snapshot) => {
      const data = snapshot.val();
      setPrompt(data.prompt);
      setContent(data.content);
      setDate(data.date);
    }).catch((error) => {
      console.error("Error retrieving data from the database: ", error);
    });
  }, []);

  // Handle the save button press
  const handleSave = () => {
    // Update the diary entry data with the new prompt and content
    const updatedData = {
      date: date,
      prompt: prompt,
      content: content
    };
    const database = getDatabase();
    const currentUser = auth.currentUser;
    const reference = ref(database, 'users/' + currentUser.uid + '/journal_entries/' + entry.key);
    set(reference, updatedData).then(() => {
      console.log("Data successfully updated in the database");
      navigation.goBack(); // Navigate back to the previous screen
    }).catch((error) => {
      console.error("Error updating data in the database: ", error);
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} index={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.journalingSection}>
          {/* DONE Button */}
          <View
            style={{
              borderWidth: 1,
              borderColor: COLORS.darkblue,
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              paddingTop: 40,
              paddingRight: 10,
              paddingBottom: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              backgroundColor: 'white',
              zIndex: 1
            }}
          >
            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: '#4285F4', fontSize: 15 }}>Done</Text>
            </TouchableOpacity>
          </View>
          {/* PAGE VIEW */}
          <View style = {{alignItems: 'center', backgroundColor: 'white', flex:1, paddingTop: SIZES.width*0.25}}>
            <View>
              <Text style={styles.header}>{prompt}</Text>
            </View>
    
            <TextInput
              style={styles.journalInput}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline={true}
            />
            <View style={{ marginTop: 10}}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.darkblue }}>{date}</Text>
            </View>
          </View>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
}

export default EditEntryScreen;

const styles = StyleSheet.create({
  header: {
    color: COLORS.darkblue,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 12,
    
  },
  journalingSection: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalInput: {
    height: SIZES.height*0.5,
    width: SIZES.width*0.9,
    borderWidth: 1,
    borderColor: COLORS.darkblue,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: '300'
  },
})