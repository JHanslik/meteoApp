import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getWeatherIcon } from "../services/weatherApi";
import { useWeather } from "../contexts/WeatherContext";

const CurrentWeather = () => {
  const { weatherData, isDayTime } = useWeather();

  if (!weatherData || !weatherData.current) return null;

  const currentData = weatherData.current;

  // Déterminer si c'est le jour ou la nuit
  const iconCode = currentData.weather[0].icon;
  const isDay = iconCode.endsWith("d");

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{currentData.name}</Text>

      <View style={styles.mainInfo}>
        <Image
          source={{ uri: getWeatherIcon(currentData.weather[0].icon) }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperature}>
          {Math.round(currentData.main.temp)}°C
        </Text>
      </View>

      <Text style={styles.description}>
        {currentData.weather[0].description}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Ressenti</Text>
          <Text style={styles.detailValue}>
            {Math.round(currentData.main.feels_like)}°C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidité</Text>
          <Text style={styles.detailValue}>{currentData.main.humidity}%</Text>
        </View>

        {/* Option: Afficher l'heure du lever/coucher du soleil */}
        {currentData.sys && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>
              {isDay ? "Coucher" : "Lever"}
            </Text>
            <Text style={styles.detailValue}>
              {new Date(
                (isDay ? currentData.sys.sunset : currentData.sys.sunrise) *
                  1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(61, 61, 61, 0.81)",
    margin: 10,
    alignItems: "center",
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 18,
    textTransform: "capitalize",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default CurrentWeather;
