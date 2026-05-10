declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_DB_NAME: string;
    }
  }
}
export {};
