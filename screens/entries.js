import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { db, auth } from './firebase';
import Card from '../shared/card';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../shared/BackButton';


function Entries() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  //Edit Entry
  const handleEditPress = () => {
    navigation.navigate('EditEntryScreen', { entry: selectedEntry });
  };

  //Delete Entry
  const handleDeletePress = () => {
    const currentUser = auth.currentUser;
    const entryRef = ref(db, `users/${currentUser.uid}/journal_entries/${selectedEntry.key}`);
    remove(entryRef)
      .then(() => {
        setSelectedEntry(null);
      })
      .catch((error) => {
        console.log("Error removing entry: ", error);
      });
  };

  //Read from DB
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentUser = auth.currentUser;
      const reference = ref(db, 'users/' + currentUser.uid + '/journal_entries');

      // assuming 'ref' is the reference you want to retrieve from
      if (ref === null) {
        console.log("History Empty");
      } else {
        // retrieve data from reference
        onValue(reference, (snapshot) => {
          const entries = [];
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const childData = childSnapshot.val();
            const entry = {
              key: key,
              prompt: childData.prompt,
              content: childData.content,
              date: childData.date
            };
            entries.push(entry);
          });
          setEntries(entries);
        });
      }
  
    });
  
    return unsubscribe;
  }, [isFocused]);

  // Update selectedEntry when navigating back from edit
  useEffect(() => {
    if (isFocused && selectedEntry) {
      const latestEntry = filteredAndSortedEntries.find((entry) => entry.key === selectedEntry.key);
      if (latestEntry) {
        setSelectedEntry(latestEntry);
      } else {
        setSelectedEntry(null);
      }
    }
  }, [isFocused, filteredAndSortedEntries]);


  //Filter and Sort entries
  const filteredAndSortedEntries = entries
  .filter((entry) => {
    const searchTermLower = searchTerm.toLowerCase();
    const dateStr = entry.date.toString();
    return (
      entry.prompt.toLowerCase().includes(searchTermLower) ||
      entry.content.toLowerCase().includes(searchTermLower) ||
      dateStr.includes(searchTermLower)
    );
  })
  .sort((a, b) => b.date.localeCompare(a.date));

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <View style={{ height: '100%' }}>
      <View style = {{backgroundColor: "white", paddingTop: 10, paddingLeft: 10}}>
        <BackButton></BackButton>
      </View>
    
      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search entries"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      
      <ScrollView>
              <View>
          {filteredAndSortedEntries.map((entry) => (
            <TouchableOpacity key={entry.key} onPress={() => handleEntryPress(entry)}>
              <View>
                <Card>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.darkblue, marginHorizontal: 5 }}>{entry.date}</Text>
                  <View style={{ padding: 10 }}></View>
                  <Text style={{ fontSize: 15, color: COLORS.darkblue, marginHorizontal: 5 }}>{entry.prompt}</Text>

                  {selectedEntry === entry && (
                    <View>
                      <View style={[styles.selectedEntry, { flex: 0, marginVertical: 25}]}>
                        <ScrollView style={{ zIndex: 1, padding: 10 }}>
                          <Text style={{ fontSize: 15, color: COLORS.darkblue, fontWeight: '500' }}>{selectedEntry.content}</Text>
                        </ScrollView>
                      </View>

                      <View style={{ zIndex: 2, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 6, marginHorizontal: 5 }}>
                        <TouchableOpacity onPress={handleDeletePress} style={[styles.deleteButton]}>
                          <AntDesign name="delete" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEditPress} style={[styles.editButton]}>
                          <AntDesign name="edit" size={30} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                </Card>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
  
    </View>
    
  );
}

const styles = StyleSheet.create({
  searchBar: {
    height: SIZES.height*0.05,
    borderRadius: 30,
    borderColor: COLORS.darkblue,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 15,
  },
  selectedEntry: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.darkblue,
    borderRadius: 10,
    marginHorizontal: 5
  },
  editButton: {
    width: 50,
    height: 50,
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: COLORS.darkblue,
    
  },
  deleteButton: {
    backgroundColor: 'red',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    // zIndex: 2
  },
  backButton: {
    marginLeft: 10,
    marginVertical: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Entries;
