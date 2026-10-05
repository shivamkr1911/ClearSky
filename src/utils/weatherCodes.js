/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */

export function getWeatherCondition(code, isDay = 1) {
  const numericCode = Number(code);

  switch (numericCode) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        category: isDay ? 'clear-day' : 'clear-night',
        description: isDay ? 'Sunny and clear conditions' : 'Clear night sky',
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        category: isDay ? 'clear-day' : 'clear-night',
        description: 'Mostly clear with minimal clouds',
      };
    case 2:
      return {
        label: isDay ? 'Partly Cloudy' : 'Partly Cloudy Night',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'partly-cloudy',
        description: 'Scattered clouds and pleasant',
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        category: 'cloudy',
        description: 'Completely covered by dense clouds',
      };
    case 45:
      return {
        label: 'Foggy',
        iconName: 'CloudFog',
        category: 'fog',
        description: 'Reduced visibility with fog',
      };
    case 48:
      return {
        label: 'Depositing Rime Fog',
        iconName: 'CloudFog',
        category: 'fog',
        description: 'Freezing fog forming frost',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        category: 'rain',
        description: 'Gentle mist and very light rain',
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        iconName: 'CloudDrizzle',
        category: 'rain',
        description: 'Steady fine drizzle',
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        iconName: 'CloudDrizzle',
        category: 'rain',
        description: 'Heavy drizzle, umbrella recommended',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudHail',
        category: 'snow',
        description: 'Icy drizzle, caution on roads',
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'CloudRain',
        category: 'rain',
        description: 'Light rain showers',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        category: 'rain',
        description: 'Steady rainfall',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRainWind',
        category: 'rain',
        description: 'Pouring heavy rainfall',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        category: 'snow',
        description: 'Freezing precipitation',
      };
    case 71:
      return {
        label: 'Slight Snow Fall',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Light snowfall flurries',
      };
    case 73:
      return {
        label: 'Moderate Snow Fall',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Accumulating snowfall',
      };
    case 75:
      return {
        label: 'Heavy Snow Fall',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Intense blizzard conditions',
      };
    case 77:
      return {
        label: 'Snow Grains',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Small icy snow grains',
      };
    case 80:
      return {
        label: 'Light Showers',
        iconName: 'CloudRain',
        category: 'rain',
        description: 'Brief light showers',
      };
    case 81:
      return {
        label: 'Moderate Showers',
        iconName: 'CloudRain',
        category: 'rain',
        description: 'Passing rain showers',
      };
    case 82:
      return {
        label: 'Violent Showers',
        iconName: 'CloudRainWind',
        category: 'rain',
        description: 'Heavy sudden torrential downpour',
      };
    case 85:
      return {
        label: 'Light Snow Showers',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Intermittent light snow showers',
      };
    case 86:
      return {
        label: 'Heavy Snow Showers',
        iconName: 'Snowflake',
        category: 'snow',
        description: 'Intermittent heavy snow showers',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        category: 'storm',
        description: 'Thunder and lightning activity',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        category: 'storm',
        description: 'Severe storm with hail hazard',
      };
    default:
      return {
        label: 'Clear',
        iconName: isDay ? 'Sun' : 'Moon',
        category: isDay ? 'clear-day' : 'clear-night',
        description: 'Fair weather conditions',
      };
  }
}

/**
 * Temperature conversion helper
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'F') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Speed conversion helper (km/h vs mph)
 */
export function formatWindSpeed(kmh, unit = 'C') {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}
