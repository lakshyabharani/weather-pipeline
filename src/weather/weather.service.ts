import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { WeatherSnapshot } from './weather.entity';

// Maps WMO weather codes to human readable descriptions
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
};

// Cities to track — coordinates for Open-Meteo API
const CITIES = [
  // North America
  { name: 'Washington DC', lat: 38.9072, lon: -77.0369 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  // Europe
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  // Asia
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  // Oceania & South America
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
];

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectRepository(WeatherSnapshot)
    private weatherRepo: Repository<WeatherSnapshot>,
  ) {}

  // Fetch weather for a single city from Open-Meteo API
  async fetchWeatherForCity(city: { name: string; lat: number; lon: number }) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=mph`;

    const response = await axios.get(url);
    const current = response.data.current;

    const snapshot = this.weatherRepo.create({
      city: city.name,
      temperature: current.temperature_2m,
      windspeed: current.wind_speed_10m,
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      description: WEATHER_DESCRIPTIONS[current.weather_code] ?? 'Unknown',
    });

    return this.weatherRepo.save(snapshot);
  }

  // Runs automatically every hour
  @Cron(CronExpression.EVERY_HOUR)
  async fetchAllCitiesScheduled() {
    this.logger.log('Running scheduled weather fetch...');
    for (const city of CITIES) {
      await this.fetchWeatherForCity(city);
      this.logger.log(`Fetched weather for ${city.name}`);
    }
  }

  // Manual trigger — fetch all cities right now
  async fetchAllCitiesNow(): Promise<WeatherSnapshot[]> {
    const results: WeatherSnapshot[] = [];
    for (const city of CITIES) {
      const snapshot = await this.fetchWeatherForCity(city);
      results.push(snapshot);
    }
    return results;
  }

  // Get latest snapshot for each city
  async getLatest() {
    return this.weatherRepo
      .createQueryBuilder('w')
      .distinctOn(['w.city'])
      .orderBy('w.city')
      .addOrderBy('w.fetchedAt', 'DESC')
      .getMany();
  }

  // Get history for a specific city
  async getHistory(city: string, limit = 24) {
    return this.weatherRepo.find({
      where: { city },
      order: { fetchedAt: 'DESC' },
      take: limit,
    });
  }

  // Get all available cities
  getCities() {
    return CITIES.map((c) => c.name);
  }
}
