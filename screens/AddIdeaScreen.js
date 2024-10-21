import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import PeopleContext from "../PeopleContext";
import { randomUUID } from "expo-crypto";

export default function AddIdeaScreen() {
  const [hasPermission, setHasPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(null);
  const [text, setText] = useState("");
  const { saveIdeas } = useContext(PeopleContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params; // Get personId from route params

  // Request camera permission
  if (!hasPermission) {
    return <View />;
  }

  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Need camera permission</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={setHasPermission}
        >
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Function to take a picture and handleSave
  const takePicture = async () => {
    if (cameraRef) {
      const data = await cameraRef.takePictureAsync();
      setPhoto(data.uri); // Set the photo URI to display
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleSave = async () => {
    if (text && photo) {
      const idea = {
        id: randomUUID(),
        text,
        img: photo,
        width: 500,
        height: 500,
      };

      await saveIdeas(personId, idea);
      navigation.navigate("Ideas", { personId, newIdea: idea });
    } else {
      Alert.alert("Please provide both an idea and an image!");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!photo ? (
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraContainer}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                >
                  <Text style={styles.cameraText}> Flip </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={takePicture}
                >
                  <Text style={styles.cameraText}> Take Picture </Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photo }} style={styles.imagePreview} />

              <TextInput
                style={styles.input}
                placeholder="Enter your idea"
                value={text}
                onChangeText={setText}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => setPhoto(null)}
                >
                  <Text style={styles.retakeText}> Retake </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}> Save </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.navigate("Ideas", { personId })}
                >
                  <Text style={styles.cancelText}> Cancel </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  cameraText: {
    fontSize: 18,
    color: "#000",
  },
  flipButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },

  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  retakeButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  retakeText: {
    fontSize: 18,
    color: "#ffffff",
  },
  saveButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  saveText: {
    fontSize: 18,
    color: "#ffffff",
  },
  cancelButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  cancelText: {
    fontSize: 18,
    color: "#ffffff",
  },

  permissionButton: {
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  permissionText: {
    fontSize: 18,
    color: "#ffffff",
  },
  message: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
});
