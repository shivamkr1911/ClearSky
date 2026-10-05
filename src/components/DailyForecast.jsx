import React from 'react';
import { Calendar, Droplet } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherCodes';

export default function DailyForecast({ daily, unit }) {
  if (!daily || daily.length === 0) return null;

  // Calculate overall min and max for proportional range bar
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="forecast-card daily-forecast-card">
      <div className="forecast-card-header">
        <div className="title-with-icon">
          <Calendar size={18} className="section-title-icon" />
          <h3 className="section-title">7-Day Forecast</h3>
        </div>
        <span className="section-hint">Daily Overview</span>
      </div>

      <div className="daily-list">
        {daily.map((day) => {
          // Calculate percentage offsets for the visual temperature bar
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / totalRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((globalMax - day.tempMax) / totalRange) * 100));

          return (
            <div key={day.date} className="daily-row">
              <div className="daily-day-col">
                <span className="daily-day-name">{day.dayLabel}</span>
                <span className="daily-date-sub">{day.formattedDate}</span>
              </div>

              <div className="daily-condition-col">
                <WeatherIcon
                  name={day.condition.iconName}
                  size={24}
                  className="daily-condition-icon"
                />
                <span className="daily-condition-text">{day.condition.label}</span>
                {day.precipitationChance > 0 && (
                  <span className="daily-rain-tag">
                    <Droplet size={11} />
                    {day.precipitationChance}%
                  </span>
                )}
              </div>

              <div className="daily-temp-col">
                <span className="temp-min-text">{formatTemp(day.tempMin, unit)}</span>
                
                {/* Visual temperature range bar */}
                <div className="temp-range-bar-track" title={`Min: ${day.tempMin}°C, Max: ${day.tempMax}°C`}>
                  <div
                    className="temp-range-bar-fill"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                    }}
                  />
                </div>

                <span className="temp-max-text">{formatTemp(day.tempMax, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
