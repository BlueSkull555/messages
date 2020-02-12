import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  View,
  Text
} from "react-native";

import db from "../db.js";
import User from "./User";
import firebase from "firebase/app";
import "firebase/auth";

export default function LinksScreen() {
  const [view, setView] = React.useState("A");
  const [allUsers, setAllUsers] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const [blocks, setBlocks] = React.useState([]);
  const [uid, setUid] = React.useState("");

  const handleAllView = () => {
    setView("A");
  };
  const handleFriendsView = () => {
    setView("F");
  };

  const handleAdd = user => {
    db.collection("friends").add({ user: uid, friend: user.id });
  };

  const handleRemove = user => {
    db.collection("friends")
      .doc(friends.find(friend => friend.friend === user.id).id)
      .delete();
  };

  const handleBlock = user => {
    db.collection("blocked").add({ user: uid, blocked: user.id });
  };

  const handleRemoveBlock = user => {
    db.collection("blocked")
      .doc(blocks.find(block => block.blocked === user.id).id)
      .delete();
  };

  useEffect(() => {
    setUid(firebase.auth().currentUser.uid);
  });

  useEffect(() => {
    const uuid = firebase.auth().currentUser.uid;
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

  useEffect(() => {
    const uuid = firebase.auth().currentUser.uid;
    db.collection("blocked")
      .where("user", "==", uuid)
      .onSnapshot(querySnapshot => {
        const blocks = [];
        querySnapshot.forEach(doc => {
          blocks.push({ id: doc.id, ...doc.data() });
        });
        console.log("Blocks: ", blocks);
        setBlocks([...blocks]);
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
              uid !== user.id ? (
                friends.find(f => f.friend === user.id) === undefined ? (
                  <View key={i} style={{ flexDirection: "row" }}>
                    <User
                      user={user}
                      handleAdd={handleAdd}
                      handleBlock={handleBlock}
                    />
                  </View>
                ) : null
              ) : null
            )
          : friends.map((friend, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                <User
                  user={allUsers.find(user => user.id === friend.friend)}
                  handleRemove={handleRemove}
                />
              </View>
            ))}

        <View>
          <Text>Blocked:</Text>
          {blocks.map((block, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              <User
                user={allUsers.find(user => user.id === block.blocked)}
                handleRemoveBlock={handleRemoveBlock}
              />
            </View>
          ))}
        </View>
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
