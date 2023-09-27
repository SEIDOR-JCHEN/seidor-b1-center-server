export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: number;
      JWT_ACCESS_TOKEN_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRES_IN?: number;
      JWT_REFRESH_TOKEN_SECRET?: string;
      JWT_REFRESH_TOKEN_EXPIRES_IN?: number;
      DATABASE_URL: string;
    }
  }
}
