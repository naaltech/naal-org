// @ts-check
import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify"

export default defineConfig({
  site: "https://naal.org.tr",
  // Subdomain yönlendirmeleri her istekte çalışmalı, bu yüzden sayfalar prerender edilmiyor.
  output: "server",
  adapter: netlify(),
  redirects: {
    "/home": "/",
    "/index": "/",
  },
  security: {
    allowedDomains: [{ hostname: "naal.org.tr" }, { hostname: "**.naal.org.tr" }],
  },
  vite: {
    // Netlify'daki mevcut ortam değişkenleri aynı isimle kullanılmaya devam eder.
    envPrefix: ["PUBLIC_", "NEXT_PUBLIC_"],
  },
})
