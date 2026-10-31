/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_SUPABASE_URL: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  readonly NEXT_PUBLIC_GA_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
