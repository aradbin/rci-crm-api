import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { RequestContextMiddleware } from './middlewares/RequestContextMiddleware';

async function bootstrap() {
  // load .env file
  config();
  const app = await NestFactory.create(AppModule, { cors: true });
  // const redisIoAdapter = new RedisIoAdapter(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // await redisIoAdapter.connectToRedis(process.env.REDIS_URL);
  // app.useWebSocketAdapter(redisIoAdapter);
  app.use(RequestContextMiddleware);

  await app.listen(8081);
}

bootstrap();
