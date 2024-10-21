import { StyleSheet, View } from "react-native";
import AppNavigator from "./AppNavigator";
import { PeopleProvider } from "./PeopleContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      //if the font is loaded  the appIsReady variable is set to true
      //which will render the <View></View>
      //when it finishes creating its layout it will call this callback function
      //which will hide the SplashScreen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // doing this stops the return below with the <View>...
    return null;
  }
  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <PeopleProvider>
        <AppNavigator />
      </PeopleProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
