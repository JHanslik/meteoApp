import axios from "axios";

const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    // Appel à OpenWeatherMap pour la météo actuelle
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=fr`
    );

    // Appel à Open-Meteo pour les prévisions horaires
    const hourlyForecastResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode&current_weather=true&timezone=auto`
    );

    return {
      current: currentWeatherResponse.data,
      hourly: hourlyForecastResponse.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo:", error);
    throw error;
  }
};

// Fonction pour obtenir l'icône météo OpenWeatherMap
export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Fonction pour convertir les codes météo Open-Meteo en codes d'icônes
export const getIconForWeatherCode = (weatherCode, isDay = true) => {
  // Codes de base pour chaque condition météo
  const baseCodes = {
    0: "01", // Ciel dégagé
    1: "02", // Principalement dégagé
    2: "03", // Partiellement nuageux
    3: "04", // Nuageux
    45: "50", // Brouillard
    48: "50", // Brouillard givrant
    51: "09", // Bruine légère
    53: "09", // Bruine modérée
    55: "09", // Bruine dense
    61: "10", // Pluie légère
    63: "10", // Pluie modérée
    65: "10", // Pluie forte
    71: "13", // Neige légère
    73: "13", // Neige modérée
    75: "13", // Neige forte
    80: "09", // Averses de pluie légères
    81: "09", // Averses de pluie modérées
    82: "09", // Averses de pluie violentes
    95: "11", // Orage
    96: "11", // Orage avec grêle légère
    99: "11", // Orage avec grêle forte
  };

  // Ajouter le suffixe jour/nuit
  const suffix = isDay ? "d" : "n";
  const baseCode = baseCodes[weatherCode] || "01";

  return `https://openweathermap.org/img/wn/${baseCode}${suffix}@2x.png`;
};
