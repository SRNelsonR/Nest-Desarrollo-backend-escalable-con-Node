import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      // Solo deja la data que estoy esperando
      whitelist: true,
      // Informa las propiedades que no son necesaarias enviar
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`App running on port ${ process.env.PORT }`);
}
bootstrap();
