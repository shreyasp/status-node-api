import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Status App REST API')
    .setDescription('REST API for Status App consumers')
    .setVersion('0.0.1')
    .addTag('Status')
    .setContactEmail('ektelesi.dev@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
