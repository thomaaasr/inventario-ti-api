import { INestApplication, ValidationPipe } from '@nestjs/common';

// Configurações globais da API, usadas pelo main.ts e pelos testes e2e,
// para que os testes rodem a API exatamente como ela roda de verdade.
export function configurarApp(app: INestApplication) {
  // Permite que páginas de outros endereços (como o front-end em React) chamem a API pelo navegador.
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Converte os dados recebidos para o tipo do DTO (por exemplo, "2" da URL vira o número 2).
      transform: true,
    }),
  );
}
