import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Nevzat Ayaz Etkileşim Ağı. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Açık Kaynak: <Link href="https://github.com/naaltech/naal-org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</Link>
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              İmza: <Link href="https://www.instagram.com/erdemhglu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">@erdemhglu</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
