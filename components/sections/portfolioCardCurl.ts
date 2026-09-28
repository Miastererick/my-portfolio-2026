// Cached image strips bend through compositor transforms, with no SVG filters.
export function createCardCurl(card: HTMLElement) {
  const source = card.querySelector<HTMLImageElement>(".portfolio-stage-image img");
  const original = card.querySelector<HTMLElement>(".portfolio-stage-image");
  if (!source || !original) return null;

  const count = 20;
  const layer = document.createElement("span");
  layer.className = "portfolio-card-curl";
  Object.assign(layer.style, { position: "absolute", inset: "0", display: "none", pointerEvents: "none" });
  layer.setAttribute("aria-hidden", "true");
  const strips = Array.from({ length: count }, () => {
    const strip = document.createElement("span");
    strip.className = "portfolio-card-curl-strip";
    Object.assign(strip.style, {
      position: "absolute", left: "0", width: "100%", display: "block",
      backgroundRepeat: "no-repeat", transformOrigin: "left top", willChange: "transform",
    });
    layer.append(strip);
    return strip;
  });
  original.after(layer);
  let width = 0;
  let height = 0;
  let ready = false;
  let active = false;

  function measure() {
    if (!source || !original || !source.naturalWidth) return;
    width = original.clientWidth;
    height = original.clientHeight;
    if (!width || !height) return;
    const scale = Math.max(width / source.naturalWidth, height / source.naturalHeight);
    const imageWidth = source.naturalWidth * scale;
    const imageHeight = source.naturalHeight * scale;
    strips.forEach((strip, index) => {
      const top = height * index / count;
      Object.assign(strip.style, {
        top: `${top}px`,
        height: `${height / count + (index < count - 1 ? 1.5 : 0)}px`,
        backgroundImage: `url(${JSON.stringify(source.currentSrc || source.src)})`,
        backgroundSize: `${imageWidth}px ${imageHeight}px`,
        backgroundPosition: `${(width - imageWidth) / 2}px ${(height - imageHeight) / 2 - top}px`,
      });
    });
    ready = true;
  }

  const curve = (y: number) => Math.pow(Math.max(0, (y - 0.4) / 0.7), 3);
  // Endpoints are shared between strips, so adjoining edges remain aligned.
  const offsets = Array.from({ length: count + 1 }, (_, i) => curve(i / count));
  function render(amount: number, visible: boolean) {
    const nextActive = ready && visible && Math.abs(amount) > 0.002;
    if (active !== nextActive) {
      active = nextActive;
      layer.style.display = active ? "block" : "none";
      original!.style.visibility = active ? "hidden" : "";
    }
    if (!active) return;
    const amplitude = amount * width * 0.12;
    strips.forEach((strip, index) => {
      const x = amplitude * offsets[index];
      const slope = amplitude * (offsets[index + 1] - offsets[index]) / (height / count);
      strip.style.transform = `matrix(1,0,${slope},1,${x},0)`;
    });
  }

  source.addEventListener("load", measure);
  const observer = new ResizeObserver(measure);
  observer.observe(original);
  measure();
  return {
    render,
    destroy() {
      observer.disconnect();
      source.removeEventListener("load", measure);
      original.style.visibility = "";
      layer.remove();
    },
  };
}
