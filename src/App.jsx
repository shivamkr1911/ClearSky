import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import WeatherMetricsGrid from './components/WeatherMetricsGrid';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import {
  searchLocations,
  getWeatherByCoordinates,
  reverseGeocode,
} from './services/weatherService';

const DEFAULT_LOCATION = {
  name: 'London',
  displayName: 'London, England, United Kingdom',
  latitude: 51.5085,
  longitude: -0.1257,
  country: 'United Kingdom',
};

export default function App() {
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather_unit') || 'C';
  });

  const [activeLocation, setActiveLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('last_weather_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Save temperature unit selection
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather_unit', newUnit);
  };

  // Location selection handler
  const handleSelectLocation = (locationObj) => {
    if (!locationObj || !locationObj.latitude || !locationObj.longitude) return;
    setActiveLocation(locationObj);
  };

  // Fetch weather data when active location changes or retry triggered
  useEffect(() => {
    if (!activeLocation?.latitude || !activeLocation?.longitude) return;

    let isCancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const data = await getWeatherByCoordinates(
          activeLocation.latitude,
          activeLocation.longitude,
          activeLocation
        );
        if (!isCancelled) {
          setWeatherData(data);
          localStorage.setItem('last_weather_location', JSON.stringify(activeLocation));
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Weather fetch error:', err);
          setError(
            err.message ||
              `Unable to fetch weather data for ${activeLocation.name || 'this location'}. Please try again.`
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [activeLocation, refreshIndex]);

  // Handle direct text searches from the search input
  const handleDirectSearch = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchLocations(cityName.trim());
      if (!results || results.length === 0) {
        setError(`No location found for "${cityName}". Please check the spelling and try again.`);
        setLoading(false);
        return;
      }
      // Pick top matching location
      setActiveLocation(results[0]);
    } catch (err) {
      console.error('Direct search error:', err);
      setError(err.message || `Failed to search for location "${cityName}".`);
      setLoading(false);
    }
  };

  // Geolocation handling
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locationInfo = await reverseGeocode(lat, lon);
          setActiveLocation(locationInfo);
        } catch (err) {
          console.error('Current location resolution error:', err);
          setError('Could not identify your current location details.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Could not access your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search manually.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Current location information is unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Request to get location timed out. Please try again.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="app-layout">
      <div className="app-container">
        {/* Top Header */}
        <Header
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
        />

        {/* Prominent Search Bar */}
        <SearchBar
          onSelectLocation={handleSelectLocation}
          onDirectSearch={handleDirectSearch}
          activeLocationName={activeLocation?.name}
        />

        {/* Dynamic Content Area */}
        <main className="main-weather-content">
          {loading && <LoadingState locationName={activeLocation?.name} />}

          {!loading && error && (
            <ErrorState
              message={error}
              onRetry={() => setRefreshIndex((prev) => prev + 1)}
              onDefaultCity={() => setActiveLocation(DEFAULT_LOCATION)}
            />
          )}

          {!loading && !error && weatherData && (
            <div className="weather-dashboard">
              {/* Primary Current Weather Card */}
              <CurrentWeatherCard weather={weatherData} unit={unit} />

              {/* 4 Key Metrics: Feels Like, Humidity, Wind Speed, Precipitation */}
              <WeatherMetricsGrid current={weatherData.current} unit={unit} />

              {/* Hourly Forecast for Today */}
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />

              {/* 7-Day Forecast */}
              <DailyForecast daily={weatherData.daily} unit={unit} />
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>
            Powered by live global data from{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Open-Meteo
            </a>
            . Clean, reliable, and real-time.
          </p>
        </footer>
      </div>
    </div>
  );
}
