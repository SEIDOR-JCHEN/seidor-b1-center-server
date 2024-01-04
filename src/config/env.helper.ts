import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const shareEnv = '.env';
  const shareEnvPath = resolve(`${dest}/${shareEnv}`);
  const shareLocalEnv = '.env.local';
  const shareLocalEnvPath = resolve(`${dest}/${shareLocalEnv}`);

  if (existsSync(shareLocalEnvPath)) {
    console.log(`\nUsing environment file: ${shareLocalEnv}`);
  } else {
    if (existsSync(shareEnvPath)) {
      console.log(`\nUsing environment file: ${shareEnv}`);
    }
  }

  const env: string | undefined = process.env.NODE_ENV;
  const localEnvFileName = `.env.${env}.local`;
  const localEnvFilePath = resolve(`${dest}/${localEnvFileName}`);
  const envFileName = `.env.${env}`;
  const envFilePath = resolve(`${dest}/${envFileName}`);

  if (!existsSync(localEnvFilePath)) {
    if (!existsSync(envFilePath)) {
      throw new Error(
        `Environment file not found at path: ${localEnvFilePath} or ${envFilePath}`,
      );
    }
    console.log(`Using environment file: ${envFileName}`);
    return envFilePath;
  }

  console.log(`Using environment file: ${localEnvFileName}`);
  return localEnvFilePath;
}
