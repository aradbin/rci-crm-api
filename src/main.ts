import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestContextMiddleware } from './middlewares/RequestContextMiddleware';
import { RedisIoAdapter } from './middlewares/redis.adapter';

async function bootstrap() {
  // load .env file
  config();
  const app = await NestFactory.create(AppModule, { cors: true });
  const redisIoAdapter = new RedisIoAdapter(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await redisIoAdapter.connectToRedis(process.env.REDIS_URL);
  app.useWebSocketAdapter(redisIoAdapter);
  app.use(RequestContextMiddleware);

  await app.listen(8080);
}

bootstrap();
