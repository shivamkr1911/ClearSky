import React from 'react';
import { CloudSun, Navigation } from 'lucide-react';

export default function Header({ unit, onToggleUnit, onUseCurrentLocation, isLocating }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon-wrapper">
          <CloudSun className="logo-icon" size={28} />
        </div>
        <div>
          <h1 className="app-title">ClearSky</h1>
          <p className="app-subtitle">Real-time weather forecast</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className={`location-btn ${isLocating ? 'locating' : ''}`}
          onClick={onUseCurrentLocation}
          title="Use your current location"
          disabled={isLocating}
        >
          <Navigation size={16} className={isLocating ? 'spin' : ''} />
          <span className="btn-label">{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>

        <div className="unit-toggle" role="group" aria-label="Temperature unit selector">
          <button
            type="button"
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
            aria-pressed={unit === 'C'}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
            aria-pressed={unit === 'F'}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
