import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('weather_snapshots')
export class WeatherSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column('float')
  temperature: number;

  @Column('float')
  windspeed: number;

  @Column('float')
  humidity: number;

  @Column()
  weatherCode: number; // WMO weather code (0=clear, 61=rain, etc)

  @Column()
  description: string;

  @CreateDateColumn()
  fetchedAt: Date;
}
