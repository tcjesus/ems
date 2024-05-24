import { Reflector } from '@nestjs/core';

class LogConfig {
  resource: string;
  action: string;
}

export const Logs = Reflector.createDecorator<LogConfig>();