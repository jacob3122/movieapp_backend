import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { CustomBadRequestFilter } from './Error Handlers/BadRequestException';
import { HeaderInterceptor } from './Interceptor/transform.interceptor';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true });
  const authService = app.get(AuthService);
  app.useGlobalInterceptors(
    new HeaderInterceptor(new JwtService(), authService),
  );
  app.useGlobalFilters(new CustomBadRequestFilter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: true,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();
