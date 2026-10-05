import { getWeatherCondition } from '../utils/weatherCodes.js';

/**
 * Configuration from environment variables
 * Vite exposes variables prefixed with VITE_ via import.meta.env
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const WEATHER_PROVIDER = env.VITE_WEATHER_PROVIDER || 'open-meteo';
const OPENWEATHER_API_KEY = env.VITE_OPENWEATHER_API_KEY || '';

/**
 * Search locations by name/query
 * @param {string} query 
 * @returns {Promise<Array>} List of matching locations
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const sanitizedQuery = query.trim();

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sanitizedQuery)}&count=6&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Location search failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item) => {
      const parts = [item.name];
      if (item.admin1 && item.admin1 !== item.name) {
        parts.push(item.admin1);
      }
      if (item.country) {
        parts.push(item.country);
      }

      return {
        id: `${item.latitude}_${item.longitude}`,
        name: item.name,
        admin1: item.admin1 || '',
        country: item.country || '',
        countryCode: item.country_code || '',
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'auto',
        displayName: parts.join(', '),
      };
    });
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Unable to search for locations. Please check your internet connection.');
  }
}

/**
 * Fetch weather data for given coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {Object} locationMeta 
 * @returns {Promise<Object>} Normalized weather payload
 */
export async function getWeatherByCoordinates(latitude, longitude, locationMeta = {}) {
  // If user explicitly configured OpenWeatherMap with a valid key
  if (WEATHER_PROVIDER === 'openweathermap' && OPENWEATHER_API_KEY) {
    return fetchFromOpenWeatherMap(latitude, longitude, locationMeta);
  }

  // Default robust provider: Open-Meteo (real-time, zero-key, global)
  return fetchFromOpenMeteo(latitude, longitude, locationMeta);
}

/**
 * Open-Meteo Integration (Default Provider)
 */
async function fetchFromOpenMeteo(latitude, longitude, locationMeta) {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m'
    );
    url.searchParams.set('hourly', 'temperature_2m,weather_code,precipitation_probability');
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
    );
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather service responded with error status ${response.status}`);
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error('Incomplete weather information received.');
    }

    const condition = getWeatherCondition(data.current.weather_code, data.current.is_day);

    // Parse next 24 hours of hourly data (step by 2-3 hours for clean UI)
    const hourlyItems = [];
    if (data.hourly && data.hourly.time) {
      const nowIso = data.current.time;
      let startIndex = data.hourly.time.findIndex((t) => t >= nowIso);
      if (startIndex === -1) startIndex = 0;

      // Take next 8 intervals (e.g. every 2-3 hours)
      for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i += 3) {
        const timeStr = data.hourly.time[i];
        const dateObj = new Date(timeStr);
        const hours = dateObj.getHours();
        const formattedTime = `${hours.toString().padStart(2, '0')}:00`;
        const itemCondition = getWeatherCondition(
          data.hourly.weather_code[i],
          hours >= 6 && hours < 20 ? 1 : 0
        );

        hourlyItems.push({
          time: formattedTime,
          fullTime: timeStr,
          temp: data.hourly.temperature_2m[i],
          condition: itemCondition,
          precipitationChance: data.hourly.precipitation_probability
            ? data.hourly.precipitation_probability[i] || 0
            : 0,
        });
      }
    }

    // Parse 7-day daily forecast
    const dailyItems = [];
    if (data.daily && data.daily.time) {
      const daysCount = Math.min(7, data.daily.time.length);
      for (let i = 0; i < daysCount; i++) {
        const dateStr = data.daily.time[i];
        const dateObj = new Date(dateStr + 'T00:00:00');

        let dayLabel = 'Today';
        if (i === 1) dayLabel = 'Tomorrow';
        else if (i > 1) {
          dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
        }

        const formattedDate = dateObj.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });

        const dayCondition = getWeatherCondition(data.daily.weather_code[i], 1);

        dailyItems.push({
          date: dateStr,
          dayLabel,
          formattedDate,
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          condition: dayCondition,
          precipitationChance: data.daily.precipitation_probability_max
            ? data.daily.precipitation_probability_max[i] || 0
            : 0,
        });
      }
    }

    return {
      location: {
        name: locationMeta.name || 'Selected Location',
        displayName:
          locationMeta.displayName ||
          [locationMeta.name, locationMeta.admin1, locationMeta.country].filter(Boolean).join(', ') ||
          'Selected Location',
        latitude,
        longitude,
        country: locationMeta.country || '',
      },
      current: {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitation: data.current.precipitation,
        isDay: Boolean(data.current.is_day),
        condition,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      hourly: hourlyItems,
      daily: dailyItems,
      provider: 'Open-Meteo',
    };
  } catch (error) {
    console.error('Error fetching Open-Meteo weather data:', error);
    throw new Error(error.message || 'Failed to retrieve weather data.');
  }
}

/**
 * OpenWeatherMap Integration (Alternative if API key is provided)
 */
async function fetchFromOpenWeatherMap(latitude, longitude, locationMeta) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid OpenWeatherMap API Key. Please check your .env file.');
      }
      throw new Error(`OpenWeatherMap error status: ${response.status}`);
    }
    const data = await response.json();

    // Also get 5 day / 3 hour forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    const condition = {
      label: data.weather[0]?.main || 'Clear',
      description: data.weather[0]?.description || '',
      iconName: data.weather[0]?.main === 'Rain' ? 'CloudRain' : data.weather[0]?.main === 'Clouds' ? 'Cloud' : 'Sun',
      category: data.weather[0]?.main?.toLowerCase() || 'clear-day',
    };

    const hourlyItems = [];
    if (forecastData && forecastData.list) {
      forecastData.list.slice(0, 8).forEach((item) => {
        const d = new Date(item.dt * 1000);
        hourlyItems.push({
          time: `${d.getHours().toString().padStart(2, '0')}:00`,
          fullTime: d.toISOString(),
          temp: item.main.temp,
          condition: {
            label: item.weather[0]?.main || 'Clear',
            iconName: item.weather[0]?.main === 'Rain' ? 'CloudRain' : 'Cloud',
          },
          precipitationChance: Math.round((item.pop || 0) * 100),
        });
      });
    }

    return {
      location: {
        name: locationMeta.name || data.name,
        displayName: locationMeta.displayName || `${data.name}, ${data.sys?.country}`,
        latitude,
        longitude,
        country: locationMeta.country || data.sys?.country || '',
      },
      current: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: (data.wind.speed * 3.6).toFixed(1), // convert m/s to km/h
        precipitation: data.rain ? data.rain['1h'] || 0 : 0,
        isDay: true,
        condition,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      hourly: hourlyItems,
      daily: [], // fallback to open-meteo daily if needed
      provider: 'OpenWeatherMap',
    };
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    // Graceful fallback to Open-Meteo so user experience never fails
    console.warn('Falling back to Open-Meteo for reliable weather retrieval...');
    return fetchFromOpenMeteo(latitude, longitude, locationMeta);
  }
}

/**
 * Reverse geocoding to resolve city name from latitude and longitude
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
    );
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      data.address?.state ||
      'Current Location';
    const country = data.address?.country || '';
    return {
      name: city,
      country,
      displayName: [city, country].filter(Boolean).join(', '),
      latitude,
      longitude,
    };
  } catch (error) {
    console.warn('Reverse geocoding error, falling back:', error);
    return {
      name: 'Current Location',
      country: '',
      displayName: 'Current Location',
      latitude,
      longitude,
    };
  }
}
