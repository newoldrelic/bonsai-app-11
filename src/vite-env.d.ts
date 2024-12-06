/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEBUG_LEVELS: string
    // Add other env variables you use
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }