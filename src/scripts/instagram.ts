import "./post-dialog"
import { toast } from "./toast"

const HIGHLIGHT_DURATION = 8000

async function sharePost(button: HTMLElement) {
  const { sharePath, shareTitle, shareText } = button.dataset
  const url = `${window.location.origin}${sharePath}`
  const shareData = { title: shareTitle, text: shareText, url }

  // Önce cihazın paylaşım menüsünü dene (mobil)
  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData)
      return
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error)
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url)
    toast({ title: "Link kopyalandı!", description: "Paylaşım linki panoya kopyalandı." })
  } catch (error) {
    console.error("Copy failed:", error)
    prompt("Link kopyalamak için Ctrl+C yapın:", url)
  }
}

// Dialog body altında açıldığı için tıklamalar document'te yakalanır.
document.addEventListener("click", (event) => {
  const shareButton = (event.target as HTMLElement).closest<HTMLElement>("[data-share-path]")
  if (shareButton) sharePost(shareButton)
})

const page = document.querySelector<HTMLElement>("[data-instagram-page]")!

const setTotalCount = (count: string) => {
  document.querySelectorAll("[data-total-count]").forEach((element) => {
    element.textContent = count
  })
}

setTotalCount(page.dataset.postCount!)

const { sharedPost, sharedPostName } = page.dataset
if (sharedPost) {
  const postElement = document.getElementById(`post-${sharedPost}`)!
  postElement.scrollIntoView({ behavior: "smooth", block: "center" })
  toast({ title: "Paylaşım bulundu!", description: `${sharedPostName} paylaşımı gösteriliyor.` })
  setTimeout(() => postElement.removeAttribute("data-highlighted"), HIGHLIGHT_DURATION)
} else if ("sharedPostMissing" in page.dataset) {
  toast({ title: "Paylaşım bulunamadı", description: "Aranan Instagram paylaşımı bulunamadı.", variant: "destructive" })
}

const loadMoreButton = page.querySelector<HTMLButtonElement>("[data-load-more]")

loadMoreButton?.addEventListener("click", async () => {
  const label = loadMoreButton.querySelector("span")!
  const grid = page.querySelector<HTMLElement>("[data-post-grid]")!
  const offset = Number(loadMoreButton.dataset.nextOffset)

  loadMoreButton.disabled = true
  label.textContent = "Yükleniyor..."

  try {
    const response = await fetch(`/instagram/posts?offset=${offset}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const template = document.createElement("template")
    template.innerHTML = await response.text()
    const batch = template.content.querySelector<HTMLElement>("[data-has-more]")!

    for (const card of Array.from(batch.children)) {
      if (!document.getElementById(card.id)) grid.append(card)
    }

    page.querySelector("[data-loaded-count]")!.textContent = String(grid.children.length)
    setTotalCount(batch.dataset.totalCount!)

    loadMoreButton.dataset.nextOffset = String(offset + 12)
    if (batch.dataset.hasMore !== "true") loadMoreButton.parentElement!.remove()
  } catch (error) {
    console.error("Daha fazla post yüklenirken hata:", error)
    loadMoreButton.parentElement!.remove()
  }

  loadMoreButton.disabled = false
  label.textContent = "Daha Fazla Yükle"
})
