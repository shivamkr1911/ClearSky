import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherCodes';

export default function CurrentWeatherCard({ weather, unit }) {
  if (!weather || !weather.current) return null;

  const { location, current, daily } = weather;
  const todayDaily = daily && daily[0] ? daily[0] : null;

  return (
    <div className={`weather-card current-weather-card category-${current.condition.category || 'clear-day'}`}>
      <div className="current-header">
        <div className="location-info">
          <div className="location-title-row">
            <MapPin size={22} className="location-pin" />
            <h2 className="location-name">{location.displayName || location.name}</h2>
          </div>
          <div className="update-time-row">
            <Clock size={14} />
            <span>Updated at {current.updatedAt}</span>
          </div>
        </div>

        <div className="condition-badge">
          <span>{current.condition.label}</span>
        </div>
      </div>

      <div className="current-body">
        <div className="current-temp-wrapper">
          <span className="current-temp-number">
            {formatTemp(current.temperature, unit)}
          </span>
          <div className="high-low-row">
            {todayDaily && (
              <>
                <span className="temp-range-item">
                  <ArrowUp size={14} className="icon-up" />
                  H: {formatTemp(todayDaily.tempMax, unit)}
                </span>
                <span className="temp-range-item">
                  <ArrowDown size={14} className="icon-down" />
                  L: {formatTemp(todayDaily.tempMin, unit)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="current-icon-col">
          <div className="large-icon-wrapper">
            <WeatherIcon
              name={current.condition.iconName}
              size={76}
              className="weather-current-icon"
            />
          </div>
          <p className="condition-description">{current.condition.description}</p>
        </div>
      </div>
    </div>
  );
}
