import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './Models';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is imported first
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'dpg-cp2qbf63e1ms73f3o3dg-a', // Use process.env to access environment variables
        port: +5432,
        username: 'movie_app_backend_ne9u_user',
        password: 'zmKWHRQMg46CBJEld5aGNW7w75Ed9xkI',
        database: 'movie_app_backend_ne9u',
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
