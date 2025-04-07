import React, { createContext, useState, useContext, useEffect } from "react";
import * as Location from "expo-location";
import { fetchWeatherData } from "../services/weatherApi";

// Créer le contexte
const WeatherContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Demander la permission d'accéder à la localisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission de localisation refusée");
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
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de récupérer les données météo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Déterminer si c'est le jour ou la nuit en fonction d'une heure donnée
  const isDayTime = (timestamp) => {
    if (!weatherData || !weatherData.current || !weatherData.current.sys) {
      return true; // Par défaut, on considère qu'il fait jour
    }

    const sunriseTimestamp = weatherData.current.sys.sunrise * 1000;
    const sunsetTimestamp = weatherData.current.sys.sunset * 1000;

    return timestamp > sunriseTimestamp && timestamp < sunsetTimestamp;
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        location,
        loading,
        error,
        isDayTime,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
