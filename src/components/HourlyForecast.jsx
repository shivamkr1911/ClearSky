import React from 'react';
import { Clock, Droplet } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherCodes';

export default function HourlyForecast({ hourly, unit }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="forecast-card hourly-forecast-card">
      <div className="forecast-card-header">
        <div className="title-with-icon">
          <Clock size={18} className="section-title-icon" />
          <h3 className="section-title">Today's Forecast</h3>
        </div>
        <span className="section-hint">Next 24 Hours</span>
      </div>

      <div className="hourly-scroll-container">
        {hourly.map((item, index) => (
          <div key={item.fullTime || index} className="hourly-slot-card">
            <span className="hourly-time">{item.time}</span>
            <div className="hourly-icon-wrapper">
              <WeatherIcon
                name={item.condition.iconName}
                size={28}
                className="hourly-weather-icon"
              />
            </div>
            <span className="hourly-temp">{formatTemp(item.temp, unit)}</span>
            {item.precipitationChance > 0 ? (
              <span className="hourly-rain-chance" title="Chance of rain">
                <Droplet size={10} />
                {item.precipitationChance}%
              </span>
            ) : (
              <span className="hourly-rain-placeholder">0%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
