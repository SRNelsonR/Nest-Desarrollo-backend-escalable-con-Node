import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Solo deja la data que estoy esperando
      whitelist: true,
      // Informa las propiedades que no son necesarias enviar
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
