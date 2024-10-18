import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Button,
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function PeopleScreen() {
  const navigation = useNavigation();
  const { people, deletePerson } = useContext(PeopleContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleDelete = async () => {
    if (selectedPerson) {
      await deletePerson(selectedPerson.id);
      setModalVisible(false);
      setSelectedPerson(null);
    }
  };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedPerson(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Swipeable renderRightActions={() => renderRightActions(item)}>
                <View style={styles.itemContainer}>
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.dob}>{item.dob}</Text>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <TouchableOpacity
                      style={{}}
                      onPress={() =>
                        navigation.navigate("Ideas", { personId: item.id })
                      }
                    >
                      <Image
                        source={require("../assets/terriermon.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Swipeable>
            );
          }}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Add Person"
            onPress={() => navigation.navigate("Add Person")}
            color="#2196F3"
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete {selectedPerson?.name}?
              </Text>
              <Button title="Yes, Delete" onPress={handleDelete} />
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
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    marginVertical: 8, // Space between each item
    borderRadius: 8, // Rounded corners for items
    shadowColor: "#000", // Shadow for some elevation effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dob: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginVertical: 8,
    marginRight: 6,
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
