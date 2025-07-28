import Header from "@/components/header"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Sertifika yükleniyor...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
