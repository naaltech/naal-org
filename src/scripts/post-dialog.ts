import { openDialog } from "./dialog"

// Dialog kapanıp açılınca her post son görülen fotoğraftan devam eder.
const lastImageIndexes = new Map<string, number>()

function setupCarousel(panel: HTMLElement, postId: string) {
  const carousel = panel.querySelector<HTMLElement>("[data-carousel]")
  const thumbs = Array.from(panel.querySelectorAll<HTMLElement>("[data-carousel-thumb]"))
  if (!carousel || thumbs.length === 0) return

  const image = carousel.querySelector<HTMLImageElement>("[data-carousel-image]")!
  const counter = carousel.querySelector("[data-carousel-counter]")

  const showImage = (index: number) => {
    lastImageIndexes.set(postId, index)
    image.src = thumbs[index].dataset.src!
    image.alt = `${carousel.dataset.postName} - ${index + 1}/${thumbs.length}`
    if (counter) counter.textContent = `${index + 1}/${thumbs.length}`
    thumbs.forEach((thumb, thumbIndex) => thumb.toggleAttribute("data-active", thumbIndex === index))
  }

  const currentIndex = () => lastImageIndexes.get(postId) ?? 0

  carousel.querySelector("[data-carousel-prev]")!.addEventListener("click", () => {
    showImage((currentIndex() - 1 + thumbs.length) % thumbs.length)
  })
  carousel.querySelector("[data-carousel-next]")!.addEventListener("click", () => {
    showImage((currentIndex() + 1) % thumbs.length)
  })
  thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => showImage(index)))

  showImage(currentIndex())
}

// Kartlar sonradan da eklenebildiği için tıklamalar document'te yakalanır.
document.addEventListener("click", (event) => {
  const trigger = (event.target as HTMLElement).closest("[data-post-dialog-trigger]")
  const card = trigger?.closest<HTMLElement>("[data-post]")

  if (card) {
    setupCarousel(openDialog(card.querySelector("template")!), card.dataset.post!)
  }
})
