import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getWeatherIcon } from "../services/weatherApi";

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData) return null;

  // Déterminer si c'est le jour ou la nuit
  // Vérifier si l'icône de OpenWeatherMap contient déjà 'd' ou 'n'
  // Si oui, on utilise directement cette information
  const iconCode = weatherData.weather[0].icon;
  const isDay = iconCode.endsWith("d");

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{weatherData.name}</Text>

      <View style={styles.mainInfo}>
        <Image
          source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperature}>
          {Math.round(weatherData.main.temp)}°C
        </Text>
      </View>

      <Text style={styles.description}>
        {weatherData.weather[0].description}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Ressenti</Text>
          <Text style={styles.detailValue}>
            {Math.round(weatherData.main.feels_like)}°C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidité</Text>
          <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
        </View>

        {/* Option: Afficher l'heure du lever/coucher du soleil */}
        {weatherData.sys && (
          <View style={styles.sunTimesContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                {isDay ? "Coucher" : "Lever"}
              </Text>
              <Text style={styles.detailValue}>
                {new Date(
                  (isDay ? weatherData.sys.sunset : weatherData.sys.sunrise) *
                    1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
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
  sunTimesContainer: {
    alignItems: "center",
  },
});

export default CurrentWeather;
