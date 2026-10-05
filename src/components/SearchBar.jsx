import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/weatherService';

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
  { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8678, longitude: 151.2073 },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
];

export default function SearchBar({ onSelectLocation, onDirectSearch, activeLocationName }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        if (isMounted) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Suggestion search error:', err);
          setSuggestions([]);
          setIsOpen(false);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
    onSelectLocation(location);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val || val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    if (query.trim()) {
      setIsOpen(false);
      onDirectSearch(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-section" ref={containerRef}>
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city or location (e.g. London, Tokyo, New York)..."
            aria-label="Search city or location"
            autoComplete="off"
          />
          {isSearching && (
            <Loader2 className="search-spinner spin" size={18} />
          )}
          {query && !isSearching && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              title="Clear input"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-dropdown" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={selectedIndex === index}
              className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <MapPin size={16} className="suggestion-icon" />
              <div className="suggestion-text">
                <span className="suggestion-city">{item.name}</span>
                <span className="suggestion-country">
                  {[item.admin1, item.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Quick-select popular cities */}
      <div className="quick-cities-container">
        <span className="quick-cities-label">Popular:</span>
        <div className="quick-cities-list">
          {POPULAR_CITIES.map((city) => {
            const isActive = activeLocationName && activeLocationName.toLowerCase().includes(city.name.toLowerCase());
            return (
              <button
                key={city.name}
                type="button"
                className={`quick-city-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(city)}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
