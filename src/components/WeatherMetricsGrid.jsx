import React from 'react';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';
import { formatTemp, formatWindSpeed } from '../utils/weatherCodes';

export default function WeatherMetricsGrid({ current, unit }) {
  if (!current) return null;

  const getHumidityStatus = (humidity) => {
    if (humidity < 30) return 'Dry air';
    if (humidity <= 60) return 'Comfortable';
    return 'Humid';
  };

  const getPrecipitationStatus = (precip) => {
    if (precip === 0) return 'No rain detected';
    if (precip < 2.5) return 'Light precipitation';
    if (precip < 7.6) return 'Moderate rainfall';
    return 'Heavy rainfall';
  };

  const metrics = [
    {
      id: 'feels-like',
      label: 'Feels Like',
      value: formatTemp(current.feelsLike, unit),
      icon: Thermometer,
      description: `Actual: ${formatTemp(current.temperature, unit)}`,
      iconClass: 'metric-icon-temp',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      icon: Droplets,
      description: getHumidityStatus(current.humidity),
      iconClass: 'metric-icon-humidity',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed, unit),
      icon: Wind,
      description: 'Surface wind velocity',
      iconClass: 'metric-icon-wind',
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: `${current.precipitation} mm`,
      icon: CloudRain,
      description: getPrecipitationStatus(current.precipitation),
      iconClass: 'metric-icon-rain',
    },
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.id} className="metric-card">
            <div className="metric-card-header">
              <span className="metric-label">{metric.label}</span>
              <div className={`metric-icon-circle ${metric.iconClass}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-desc">{metric.description}</div>
          </div>
        );
      })}
    </div>
  );
}
