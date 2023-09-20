import { HttpException, Logger } from '@nestjs/common';

export function RaiseAxiosException(
  message: string,
  status: number,
  data: any,
) {
  const logger = new Logger('RaiseAxiosException', { timestamp: true });
  logger.error(message);
  logger.error(data);
  throw new HttpException(message, status, {
    cause: new Error(message),
  });
}

export function RaiseHttpException(message: string, status: number) {
  const logger = new Logger('RaiseHttpException', { timestamp: true });
  logger.error(message);
  throw new HttpException(message, status, {
    cause: new Error(message),
  });
}
