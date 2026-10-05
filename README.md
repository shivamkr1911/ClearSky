# ClearSky - Modern Weather Forecast Application

A simple, clean, and modern weather application built with React and Vite. Users can search for any city or location globally, explore current conditions, view detailed metrics, and inspect both today's hourly timeline and a 7-day forecast.

---

## 🌟 Features

- **Global Location Search:** Search any city or location with real-time autocompletion suggestions.
- **Quick-Select Popular Cities:** One-click shortcuts for London, New York, Tokyo, Paris, Sydney, and Dubai.
- **Current Conditions:** Displays temperature, weather condition description, and dynamic weather icons.
- **Key Weather Metrics:**
  - **Feels-like Temperature**
  - **Humidity Level**
  - **Wind Speed**
  - **Precipitation**
- **Today's Forecast:** Hourly breakdown over the next 24 hours with temperature and chance of rain.
- **7-Day Forecast:** Daily outlook with high/low temperatures, visual temperature range bars, and precipitation probabilities.
- **Unit Conversion:** Instant toggle between Celsius (°C) and Fahrenheit (°F) with persistent state in `localStorage`.
- **Geolocation Support:** "My Location" button to automatically detect and load weather for your current position.
- **Graceful Error & Loading States:** Clear feedback for invalid locations, network disconnects, and loading spinners with skeleton cards.
- **Responsive Card-Based UI:** Optimized for both mobile and desktop screens.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Weather API & Environment Variables

This application uses the **[Open-Meteo API](https://open-meteo.com/)** by default.

### Why Open-Meteo?
- **Zero Configuration:** Works immediately out of the box with **no API key required**.
- **Real-Time Data:** Delivers live, accurate global meteorological data, hourly predictions, and 7-day outlooks.
- **Free & Reliable:** No sign-up, credit card, or rate limit hurdles for personal use.

### Using OpenWeatherMap (Optional)
If you prefer to use **OpenWeatherMap**:
1. Sign up and obtain an API key at [OpenWeatherMap](https://openweathermap.org/api).
2. Copy `.env.example` to create `.env`:
   ```bash
   cp .env.example .env
   ```
3. Set your configuration in `.env`:
   ```env
   VITE_WEATHER_PROVIDER=openweathermap
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
4. Restart the dev server (`npm run dev`).

A template is provided in [`.env.example`](.env.example).

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template (copy to .env)
├── index.html                # App entry HTML
├── package.json              # Dependencies and build scripts
├── vite.config.js            # Vite configuration
└── src/
    ├── main.jsx              # React root mount
    ├── App.jsx               # Main state orchestrator
    ├── index.css             # Clean, responsive styling & card layouts
    ├── services/
    │   └── weatherService.js # Weather and geocoding API client
    ├── utils/
    │   └── weatherCodes.js   # WMO weather code mapping and unit formatters
    └── components/
        ├── Header.jsx             # Top bar with logo, GPS, & unit toggle
        ├── SearchBar.jsx          # Prominent search bar with autocomplete & chips
        ├── CurrentWeatherCard.jsx # Main card with temp, high/low, & condition
        ├── WeatherMetricsGrid.jsx # 4 cards: feels like, humidity, wind, rain
        ├── HourlyForecast.jsx     # Today's 24-hour timeline
        ├── DailyForecast.jsx      # 7-day forecast cards with range bars
        ├── WeatherIcon.jsx        # Dynamic Lucide icon mapper
        ├── LoadingState.jsx       # Spinner and skeleton UI
        └── ErrorState.jsx         # Graceful error messages and retry button
```
