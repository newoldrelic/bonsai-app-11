/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_LEVELS: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_SECRET_KEY: string;
  readonly VITE_STRIPE_WEBHOOK_SECRET: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@netlify/functions' {
  export interface Context {
    clientContext: {
      identity: {
        url: string;
        token: string;
      };
      user: {
        email: string;
        sub: string;
      };
    };
  }
}