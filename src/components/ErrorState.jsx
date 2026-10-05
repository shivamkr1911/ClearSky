import React from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

export default function ErrorState({ message, onRetry, onDefaultCity }) {
  return (
    <div className="error-card">
      <div className="error-icon-wrapper">
        <AlertCircle size={40} className="error-icon" />
      </div>

      <h3 className="error-title">Location or Weather Not Found</h3>
      <p className="error-message">
        {message || 'We could not load the weather data for this location. Please verify the city name or try again.'}
      </p>

      <div className="error-actions">
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
        {onDefaultCity && (
          <button type="button" className="fallback-btn" onClick={() => onDefaultCity('London')}>
            <Compass size={16} />
            <span>View London Weather</span>
          </button>
        )}
      </div>

      <div className="error-tips">
        <span className="tips-heading">Search Tips:</span>
        <ul>
          <li>Check for typos in the city name (e.g., "London", "Tokyo", "San Francisco").</li>
          <li>Try adding the country or state name (e.g., "Paris, France").</li>
          <li>Use one of the popular quick-select cities above.</li>
        </ul>
      </div>
    </div>
  );
}
