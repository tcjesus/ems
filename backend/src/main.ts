/* eslint-disable import/first */
/* eslint-disable import-helpers/order-imports */
import dotenv from 'dotenv'
dotenv.config()

import { Environment as envs } from '@/Environment'
envs.validate()

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'
import { connect } from "mqtt"

import { AppModule } from '@/AppModule'
import { AllExceptionFilter } from '@/core/helpers/AllExceptionFilter'
import { ResponseTransformInterceptor } from '@/core/helpers/ResponseTransformInterceptor'

import { SentryConfig } from '@/config/SentryConfig'
import { MonitoramentoFacade } from '@/emergency/services/MonitoramentoFacade'
import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import * as bodyParser from 'body-parser'
import helmet from 'helmet'
import { initializeTransactionalContext } from 'typeorm-transactional'

const configureSwagger = (app: INestApplication) => {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Emergency Management System - API')
    .setDescription('Emergency Management System - API Documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    },
      'Role Access Token'
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('docs', app, document)
}

const configureMqtt = (app: INestApplication) => {
  const client = connect(envs.MQTT_BROKER);
  const monitoramentoFacade = app.get<MonitoramentoFacade>(MonitoramentoFacade)

  client.on("connect", async () => {
    client.subscribe(envs.MQTT_TOPIC_RESPONSE_DATA, (error) => {
      if (!error) {
        console.log('Subscribed to MQTT topic: ', envs.MQTT_TOPIC_RESPONSE_DATA)
      }
    });
  });

  client.on("message", (topic, message) => {
    if (topic === envs.MQTT_TOPIC_RESPONSE_DATA) {
      try {
        const payload: NovoRegistroMonitoramentoPayload = JSON.parse(message.toString())
        monitoramentoFacade.process(payload)
      } catch (error) {
        console.log(`Error processing message to topic: ${envs.MQTT_TOPIC_RESPONSE_DATA}`)
        console.log(`Message: ${message.toString()}`)
        console.log(error)
      }
    }
  });

  client.on("error", async (error) => {
    if (error) {
      console.error(error);
    }
  });
}

async function bootstrap() {
  Sentry.init(SentryConfig)
  initializeTransactionalContext()

  const app = await NestFactory.create(AppModule)

  configureSwagger(app)
  configureMqtt(app)

  app.use(helmet())

  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
  app.enableCors({ optionsSuccessStatus: 200 })
  app.enableShutdownHooks()
  app.useGlobalInterceptors(new ResponseTransformInterceptor())
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  // app.enableVersioning({ type: VersioningType.URI });

  await app.listen(envs.PORT)
}

bootstrap()
