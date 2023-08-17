import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, ActivityIndicator, View } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import DataAPIActivity from "../../FetchData/FetchDataActivity";
import { COLORS, SIZES } from '../../constants';
import BackButton from "../../shared/BackButton";

export default function PickActive() {
    const [value, setValue] = useState();
    
    //Watch for changes in API data
    useEffect(() => {
      let fetchData = async () => {
        setValue(await DataAPIActivity());
      };
      fetchData();
    }, []);
  
    if (!value) {
      return (
        <ActivityIndicator
          size="large"
          animating={true}
          color="rgba(137,232,207,100)"
        />
      );
    }
    console.log(value)
  
    // Generate a random index within the range of rows in the 'value' array
    const randomIndex = Math.floor(Math.random() * value.length);
  
    // Get the row with the randomly generated index from the 'value' array
    const selectedRow = value[randomIndex];
  
    return (
      <ScrollView>
      <View style = {{backgroundColor: "white", paddingTop: 10, paddingLeft: 10}}>
        <BackButton></BackButton>
      </View>
        <Card key={randomIndex} style={styles.container}>
          <Card.Title
            // title={!selectedRow[1] ? "Not Provided" : selectedRow[1]}
            title = 
            <Text style={styles.paragraph}>
              {!selectedRow[0] ? "Not Given" : selectedRow[0]}
            </Text>
            // left={() => <Ionicons name="md-person" size={50} color="#fff" />}
            
          />
          <Card.Content style={styles.content}>
            <Text style={styles.title}>Activity Name:</Text>
            <Text style={styles.paragraph}>
              {!selectedRow[0] ? "Not Given" : selectedRow[0]}
            </Text>
          </Card.Content>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>Description:</Text>
            <Text style={styles.paragraph}>
              {!selectedRow[1] ? "Not Provided" : selectedRow[1]}
            </Text>
          </Card.Content>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>Instructions:</Text>
            <Text style={styles.paragraph}>
              {!selectedRow[2] ? "Not Provided" : selectedRow[2]}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    margin: 20,
    // borderWidth: 4,
    borderRadius: 20,
    backgroundColor: COLORS.lightblue,
    // borderColor: "rgba(137,232,207,100)",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
  },
  paragraph: {
    color: "white",
    fontSize: 18,
  },
});