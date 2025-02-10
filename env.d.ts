/// <reference types="vite/client" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly LIST_API_URL: string;
        readonly SAVE_API_URL: string;
        readonly RENAME_API_URL: string;
        readonly DELETE_API_URL: string;
    }
  }