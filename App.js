import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import { fetchWeatherData } from "./services/weatherApi";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Demander la permission d'accéder à la localisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission de localisation refusée");
          setLoading(false);
          return;
        }

        // Obtenir la position actuelle
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Récupérer les données météo
        const data = await fetchWeatherData(
          location.coords.latitude,
          location.coords.longitude
        );
        setWeatherData(data);
      } catch (error) {
        console.error("Erreur:", error);
        setErrorMsg("Impossible de récupérer les données météo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" color="#0000ff" />;
  } else if (errorMsg) {
    content = <Text style={styles.errorText}>{errorMsg}</Text>;
  } else if (weatherData) {
    content = (
      <>
        <CurrentWeather weatherData={weatherData.current} />
        <HourlyForecast hourlyData={weatherData.hourly} />
      </>
    );
  }

  return (
    <ImageBackground
      source={require("./assets/images/weather-background.jpg")} // Vous devrez ajouter cette image
      style={styles.background}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        {content}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    margin: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
});
