import { SetMetadata } from '@nestjs/common';

export const ROTA_PUBLICA = 'rotaPublica';

// Marca uma rota que pode ser acessada sem login.
export const Publico = () => SetMetadata(ROTA_PUBLICA, true);
