import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero section skeleton */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-80 mx-auto" />
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="flex gap-2 justify-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Content section skeleton */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <Skeleton className="h-32 w-48 mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-80 mx-auto" />
              </div>

              <div className="mt-12 space-y-6">
                <Skeleton className="h-8 w-48 mx-auto" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6">
                      <div className="text-center space-y-4">
                        <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
