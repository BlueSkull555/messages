import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Dimensions, Button, View } from "react-native";

import db from "../db.js";
import User from "./User";
import firebase from "firebase/app";
import "firebase/auth";

export default function LinksScreen() {
  const [view, setView] = React.useState("A");
  const [allUsers, setAllUsers] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const [uid, setUid] = React.useState("");

  const handleAllView = () => {
    setView("A");
  };
  const handleFriendsView = () => {
    setView("F");
  };

  const handleAdd = () => {};

  useEffect(() => {
    setUid(firebase.auth().currentUser.uid);
  });

  useEffect(() => {
    const uuid = firebase.auth().currentUser.uid;
    setUid(uuid);
    db.collection("friends")
      .where("user", "==", uuid)
      .onSnapshot(querySnapshot => {
        const friends = [];
        querySnapshot.forEach(doc => {
          friends.push({ id: doc.id, ...doc.data() });
        });
        console.log("Friends: ", friends);
        setFriends([...friends]);
      });
  }, []);

  useEffect(() => {
    db.collection("users").onSnapshot(querySnapshot => {
      const users = [];
      querySnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setAllUsers([...users]);
    });
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}
      >
        <Button title={"All Users"} onPress={handleAllView} />
        <Button title={"Friends"} onPress={handleFriendsView} />
      </View>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        {view === "A"
          ? allUsers.map((user, i) =>
              uid !== user.id &&
              friends.find(f => f.friend === user.id) === null ? (
                <View key={i} style={{ flexDirection: "row" }}>
                  <User user={user} />
                  <Button title="Add" onPress={() => handleUser(user)} />
                </View>
              ) : null
            )
          : friends.map((friend, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                <User user={allUsers.find(user => user.id === friend.friend)} />
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: "Friends"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
