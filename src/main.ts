import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { configurarApp } from './configurar-app.js';

async function bootstrap() {
  // Em desenvolvimento, as configurações secretas ficam no arquivo .env (fora do Git).
  // Em produção, o Render entrega as mesmas variáveis pelo painel.
  if (existsSync('.env')) {
    process.loadEnvFile();
  }

  const app = await NestFactory.create(AppModule);
  configurarApp(app);

  const config = new DocumentBuilder()
    .setTitle('Inventário de TI')
    .setDescription('API para controlar os equipamentos de TI: o que existe e com quem está.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
