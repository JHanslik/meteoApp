import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { getIconForWeatherCode } from "../services/weatherApi";

const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData || !hourlyData.hourly) return null;

  // Récupérer les données horaires pour les prochaines 24 heures
  const hourlyTimes = hourlyData.hourly.time.slice(0, 24);
  const hourlyTemps = hourlyData.hourly.temperature_2m.slice(0, 24);
  const weatherCodes = hourlyData.hourly.weathercode.slice(0, 24);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prévisions horaires</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {hourlyTimes.map((time, index) => {
          const date = new Date(time);
          const hourTime = date.getHours();

          // Déterminer si c'est le jour ou la nuit
          const isDay = hourTime >= 6 && hourTime < 20;

          return (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourText}>{hourTime}h</Text>
              <Image
                source={{
                  uri: getIconForWeatherCode(weatherCodes[index], isDay),
                }}
                style={styles.hourlyIcon}
              />
              <Text style={styles.hourlyTemp}>
                {Math.round(hourlyTemps[index])}°C
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(61, 61, 61, 0.81)",
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  scrollView: {
    flexDirection: "row",
  },
  hourlyItem: {
    alignItems: "center",
    marginRight: 15,
    width: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  hourText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#FFFFFF",
  },
  hourlyIcon: {
    width: 40,
    height: 40,
    marginVertical: 5,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default HourlyForecast;
