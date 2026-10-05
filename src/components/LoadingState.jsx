import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ locationName }) {
  return (
    <div className="loading-container">
      <div className="loading-card">
        <Loader2 className="loading-spinner spin" size={44} />
        <h3 className="loading-title">Fetching Weather Forecast</h3>
        <p className="loading-subtitle">
          {locationName
            ? `Retrieving live weather data for "${locationName}"...`
            : 'Connecting to weather satellites and sensors...'}
        </p>
      </div>

      {/* Skeleton card previews for smooth layout stability */}
      <div className="skeleton-grid">
        <div className="skeleton-card skeleton-large" />
        <div className="skeleton-metrics">
          <div className="skeleton-card skeleton-small" />
          <div className="skeleton-card skeleton-small" />
          <div className="skeleton-card skeleton-small" />
          <div className="skeleton-card skeleton-small" />
        </div>
      </div>
    </div>
  );
}
