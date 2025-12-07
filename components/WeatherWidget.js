import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchWeather();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async () => {
    try {
      // Coordinates for Surat, India (approx based on user request)
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=21.1702&longitude=-72.8311&current_weather=true"
      );
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    // Simple mapping for WMO Weather interpretation codes
    if (code === 0) return "weather-sunny";
    if (code >= 1 && code <= 3) return "weather-partly-cloudy";
    if (code >= 45 && code <= 48) return "weather-fog";
    if (code >= 51 && code <= 67) return "weather-rainy";
    if (code >= 71 && code <= 77) return "weather-snowy";
    if (code >= 95) return "weather-lightning";
    return "weather-cloudy";
  };

  const formatDate = () => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return currentTime.toLocaleDateString("en-US", options);
  };

  const formatTime = () => {
    // Force IST (UTC+5:30) if device is not in IST, or just use local if we assume device is in India.
    // Using simple local time formatting for now as React Native picks up device time.
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.timeText}>{formatTime()}</Text>
        <Text style={styles.dateText}>{formatDate()}</Text>
        <Text style={styles.welcomeText}>Welcome Home</Text>
      </View>

      <View style={styles.weatherContainer}>
        {loading ? (
          <ActivityIndicator color="#4F8EF7" />
        ) : weather ? (
          <>
            <MaterialCommunityIcons
              name={getWeatherIcon(weather.weathercode)}
              size={40}
              color="#4F8EF7"
            />
            <View style={styles.tempContainer}>
              <Text style={styles.tempText}>
                {Math.round(weather.temperature)}°
              </Text>
              <Text style={styles.conditionText}>
                {weather.weathercode === 0 ? "Clear" : "Cloudy"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>--</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flex: 1,
  },
  timeText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    opacity: 0.8,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d2d2d",
    padding: 12,
    borderRadius: 16,
    marginLeft: 15,
  },
  tempContainer: {
    marginLeft: 10,
  },
  tempText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  conditionText: {
    color: "#888",
    fontSize: 12,
  },
  errorText: {
    color: "#888",
  },
});
