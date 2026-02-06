import cors from 'cors';
import { type ServerSetupFn } from 'wasp/server';

export const serverSetup: ServerSetupFn = async ({ app }) => {
  // Configure CORS to allow requests from the deployed client
  app.use(
    cors({
      origin: [
        'https://knjizara-app-client.fly.dev',
        'http://localhost:3000', // for local development
      ],
      credentials: true,
    })
  );
};
