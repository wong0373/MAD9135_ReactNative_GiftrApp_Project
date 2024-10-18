import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PeopleContext from "../PeopleContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "people";

export default function IdeaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { personId, newIdea } = route.params || {};
  const { people, deleteIdea } = useContext(PeopleContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const person = people.find((person) => person.id === personId); // Get person details

  const handleDeleteIdea = async () => {
    if (selectedIdea) {
      await deleteIdea(selectedIdea.id, personId); // Call delete function with idea ID and person ID
      setModalVisible(false);
      setSelectedIdea(null);
    }
  };

  const renderIdeaItem = ({ item }) => (
    <View style={styles.ideaContainer}>
      <Image source={{ uri: item.img }} style={styles.thumbnail} />
      <Text style={styles.ideaText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedIdea(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Gift Ideas for {person.name}</Text>

        {person.ideas.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No ideas found. Add a new idea!
          </Text>
        ) : (
          <FlatList
            data={person.ideas}
            keyExtractor={(item) => item.id}
            renderItem={renderIdeaItem}
          />
        )}

        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("Add Ideas", { personId })} // Ensure the route name matches
          >
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Modal for Delete Confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this idea?
              </Text>
              <Button title="Yes, Delete" onPress={handleDeleteIdea} />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    marginTop: 50,
  },
  ideaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  ideaText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
  },
  fabContainer: {
    position: "absolute",
    bottom: 42,
    right: 24,
  },
  fab: {
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
