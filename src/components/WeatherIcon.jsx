import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudFog,
  CloudRainWind,
  CloudHail,
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudFog,
  CloudRainWind,
  CloudHail,
};

export default function WeatherIcon({ name, size = 24, className = '' }) {
  const IconComponent = ICON_MAP[name] || Cloud;
  return <IconComponent size={size} className={className} />;
}
