import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useWeather } from "../contexts/WeatherContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ForecastChart = () => {
  const { weatherData } = useWeather();
  const [dailyData, setDailyData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("5j"); // Options: "5j" ou "semaine"

  // Extraire et formater les données de prévision
  useEffect(() => {
    if (!weatherData || !weatherData.hourly || !weatherData.hourly.hourly)
      return;

    const hourlyData = weatherData.hourly.hourly;
    const temps = hourlyData.temperature_2m;
    const times = hourlyData.time;
    const weatherCodes = hourlyData.weathercode;

    // Calculer les données journalières à partir des données horaires
    const dailyForecast = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Créer un tableau avec les données pour 7 jours
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Trouver l'index des données horaires correspondant à midi ce jour-là
      const targetDate = date.toISOString().split("T")[0];
      const noonTime = `${targetDate}T12:00`;

      const timeIndex = times.findIndex((time) => time.startsWith(targetDate));
      const noonIndex = times.findIndex((time) => time === noonTime);

      // Utiliser l'index de midi s'il existe, sinon utiliser le premier index du jour
      const index = noonIndex !== -1 ? noonIndex : timeIndex;

      if (index !== -1) {
        // Calculer les températures min et max pour la journée
        const dayTemps = [];
        for (let j = 0; j < 24; j++) {
          const hourIndex = timeIndex + j;
          if (hourIndex < temps.length) {
            dayTemps.push(temps[hourIndex]);
          }
        }

        dailyForecast.push({
          date,
          temp: temps[index], // température à midi
          min: Math.min(...dayTemps.filter((t) => !isNaN(t))),
          max: Math.max(...dayTemps.filter((t) => !isNaN(t))),
          weatherCode: weatherCodes[index],
        });
      }
    }

    setDailyData(dailyForecast);
  }, [weatherData]);

  // Si pas de données, ne rien afficher
  if (dailyData.length === 0) return null;

  // Nombre de jours à afficher selon la sélection
  const daysToShow = selectedRange === "5j" ? 5 : 7;
  const displayData = dailyData.slice(0, daysToShow);

  const formatDay = (date) => {
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return days[date.getDay()];
  };

  // Données pour le graphique LineChart
  const chartData = {
    labels: displayData.map((day) => formatDay(day.date)),
    datasets: [
      {
        data: displayData.map((day) => day.max),
        color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`, // Utilisez opacity=1 pour une visibilité maximale
        strokeWidth: 4, // Augmentez l'épaisseur à 4 pour une meilleure visibilité
        id: "max-temp", // Ajout d'un identifiant unique
      },
      {
        data: displayData.map((day) => day.min),
        color: (opacity = 1) => `rgba(79, 195, 247, ${opacity})`, // Utilisez opacity=1 pour une visibilité maximale
        strokeWidth: 4, // Augmentez l'épaisseur à 4 pour une meilleure visibilité
        id: "min-temp", // Ajout d'un identifiant unique
      },
    ],
    legend: ["Maximale", "Minimale"],
  };

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "rgba(41, 41, 41, 0.5)",
    backgroundGradientTo: "rgba(41, 41, 41, 0.5)",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffffff", // Ajoutez une bordure blanche aux points
    },
    strokeWidth: 3, // Augmentez l'épaisseur des lignes globalement
    fillShadowGradient: "rgba(255, 255, 255, 0.2)", // Ajoutez un dégradé sous les lignes
    fillShadowGradientOpacity: 0.5, // Rendez le dégradé plus visible
  };

  // Définir dynamiquement la largeur en fonction de daysToShow
  const dayItemWidth = Math.min(85, (SCREEN_WIDTH - 40) / 5); // Taille fixe de 85 ou adaptative si l'écran est petit

  const chartWidth =
    selectedRange === "5j" ? SCREEN_WIDTH - 40 : SCREEN_WIDTH * 1.2;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prévisions</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedRange === "5j" && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedRange("5j")}
          >
            <Text
              style={[
                styles.toggleText,
                selectedRange === "5j" && styles.toggleTextActive,
              ]}
            >
              5 jours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedRange === "semaine" && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedRange("semaine")}
          >
            <Text
              style={[
                styles.toggleText,
                selectedRange === "semaine" && styles.toggleTextActive,
              ]}
            >
              Semaine
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <ScrollView
          horizontal
          bounces={true}
          bouncesZoom={true}
          alwaysBounceHorizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chartContainer,
            { paddingLeft: 0, paddingRight: 0 },
          ]}
          decelerationRate="normal"
          contentOffset={{ x: 0, y: 0 }}
        >
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              paddingRight: 15,
              paddingLeft: 10,
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withShadow={true}
            withDots={true}
            segments={4}
            formatYLabel={(value) => `${Math.round(value)}°`}
            fromZero={false}
            yAxisInterval={5}
            onDataPointClick={({ value, dataset, getColor }) => {
              console.log("Point cliqué:", value);
            }}
            renderDotContent={({ x, y, index, indexData }) => (
              <View
                key={`dot-${index}-${indexData}`}
                style={{
                  position: "absolute",
                  top: y - 10,
                  left: x - 15,
                  backgroundColor: "transparent",
                }}
              >
                {/* Info-bulle ou contenu supplémentaire pour chaque point */}
              </View>
            )}
            renderLegend={() => (
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#FF9500" }]}
                  />
                  <Text style={styles.legendText}>Maximale</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#4FC3F7" }]}
                  />
                  <Text style={styles.legendText}>Minimale</Text>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.detailsContainer}
        bounces={true}
        decelerationRate="normal"
      >
        {displayData.map((day, i) => (
          <View
            key={`day-${day.date.toISOString()}`}
            style={[
              styles.dayItem,
              { width: dayItemWidth, marginHorizontal: 4 },
            ]}
          >
            <Text style={styles.dayText}>{formatDay(day.date)}</Text>
            <Text style={styles.dateText}>
              {day.date.getDate()}/{day.date.getMonth() + 1}
            </Text>
            <View style={styles.tempRow}>
              <MaterialCommunityIcons
                name="thermometer-plus"
                size={16}
                color="#FF9500"
              />
              <Text style={[styles.tempValue, styles.maxTemp]}>
                {Math.round(day.max)}°C
              </Text>
            </View>
            <View style={styles.tempRow}>
              <MaterialCommunityIcons
                name="thermometer-minus"
                size={16}
                color="#4FC3F7"
              />
              <Text style={[styles.tempValue, styles.minTemp]}>
                {Math.round(day.min)}°C
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "rgba(61, 61, 61, 0.81)",
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 13,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  toggleText: {
    color: "#CCCCCC",
    fontSize: 12,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#333333",
  },
  chartWrapper: {
    position: "relative",
  },
  chartContainer: {
    paddingRight: 5,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexGrow: 1,
  },
  dayItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 4,
    height: 130,
    justifyContent: "center",
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    color: "#CCCCCC",
    fontSize: 12,
    marginBottom: 8,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  tempValue: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "500",
  },
  maxTemp: {
    color: "#FF9500",
  },
  minTemp: {
    color: "#4FC3F7",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
});

export default ForecastChart;
