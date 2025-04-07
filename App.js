import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import ForecastChart from "./components/ForecastChart";
import { WeatherProvider, useWeather } from "./contexts/WeatherContext";

// Composant principal qui utilise le contexte
const WeatherApp = () => {
  const { weatherData, loading, error } = useWeather();

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" color="#0000ff" />;
  } else if (error) {
    content = <Text style={styles.errorText}>{error}</Text>;
  } else if (weatherData) {
    content = (
      <ScrollView showsVerticalScrollIndicator={false}>
        <CurrentWeather />
        <HourlyForecast />
        <ForecastChart />
      </ScrollView>
    );
  }

  return (
    <ImageBackground
      source={require("./assets/images/weather-background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        {content}
      </View>
    </ImageBackground>
  );
};

// Composant racine qui enveloppe l'application avec le Provider
export default function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
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
