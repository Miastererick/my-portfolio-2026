"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { openProjectWithCurtain } from "@/components/PortfolioRouteCurtain";

type ProjectImage = {
  path: string;
  width: number;
  height: number;
  alt: string;
};

type ProjectImageStreamProps = {
  images: ProjectImage[];
  title: string;
  nextProject: { slug: string; title: string; english?: string };
};

export function ProjectImageStream({ images, title, nextProject }: ProjectImageStreamProps) {
  const [active, setActive] = useState(0);
  const imageListRef = useRef<HTMLDivElement>(null);
  const thumbnailTrackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLButtonElement>(null);
  const nextPanelRef = useRef<HTMLAnchorElement>(null);
  const dragRef = useRef<{ x: number; y: number; scrollY: number } | null>(null);

  useEffect(() => {
    const panel = nextPanelRef.current;
    const page = panel?.closest<HTMLElement>(".project-editorial");
    if (!panel || !page) return;
    const sidePanels = [
      page.querySelector<HTMLElement>(".project-editorial-sidebar"),
      page.querySelector<HTMLElement>(".project-editorial-thumbnails"),
    ].filter((item): item is HTMLElement => item !== null);

    let frame = 0;
    let wasHidden = false;
    const updateFade = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const panelTop = panel.getBoundingClientRect().top;
      const imageBottom = imageListRef.current?.getBoundingClientRect().bottom;
      const fadeProgress = imageBottom === undefined
        ? (viewportHeight * 1.08 - panelTop) / (viewportHeight * 0.08)
        : (viewportHeight + 24 - imageBottom) / Math.max(48, panelTop - imageBottom - 8);
      const progress = Math.min(1, Math.max(0, fadeProgress));
      const opacity = String(1 - progress);
      for (const sidePanel of sidePanels) sidePanel.style.opacity = opacity;
      const hidden = progress >= 0.99;
      if (hidden !== wasHidden) {
        page.classList.toggle("is-next-visible", hidden);
        wasHidden = hidden;
      }
    };
    const scheduleFade = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFade);
    };

    window.addEventListener("scroll", scheduleFade, { passive: true });
    window.addEventListener("resize", scheduleFade);
    updateFade();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleFade);
      window.removeEventListener("resize", scheduleFade);
      for (const sidePanel of sidePanels) sidePanel.style.removeProperty("opacity");
      page.classList.remove("is-next-visible");
    };
  }, []);

  useEffect(() => {
    const imageList = imageListRef.current;
    const track = thumbnailTrackRef.current;
    const viewport = viewportRef.current;
    if (!imageList || !track || !viewport) return;

    let frame = 0;
    const updateViewport = () => {
      frame = 0;
      const list = imageList.getBoundingClientRect();
      const horizontal = window.matchMedia("(max-width: 700px)").matches;
      const railLength = horizontal ? track.clientWidth : track.clientHeight;
      if (!list.height || !railLength) return;

      const start = Math.max(0, Math.min(railLength, (-list.top / list.height) * railLength));
      const end = Math.max(0, Math.min(railLength, ((window.innerHeight - list.top) / list.height) * railLength));
      const size = Math.min(railLength, Math.max(18, end - start));
      const position = `${Math.min(railLength - size, start)}px`;
      viewport.style.top = horizontal ? "0px" : position;
      viewport.style.left = horizontal ? position : "";
      viewport.style.height = horizontal ? "" : `${size}px`;
      viewport.style.width = horizontal ? `${size}px` : "";
    };
    const scheduleViewportUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateViewport);
    };

    const resizeObserver = new ResizeObserver(scheduleViewportUpdate);
    resizeObserver.observe(imageList);
    resizeObserver.observe(track);
    window.addEventListener("scroll", scheduleViewportUpdate, { passive: true });
    window.addEventListener("resize", scheduleViewportUpdate);
    scheduleViewportUpdate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleViewportUpdate);
      window.removeEventListener("resize", scheduleViewportUpdate);
      resizeObserver.disconnect();
    };
  }, [images]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.imageIndex));
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    document.querySelectorAll<HTMLElement>("[data-image-index]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [images]);

  function showImage(index: number) {
    setActive(index);
    document.getElementById(`project-image-${index + 1}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  }

  function dragViewport(event: React.PointerEvent<HTMLButtonElement>) {
    const start = dragRef.current;
    const track = thumbnailTrackRef.current;
    const imageList = imageListRef.current;
    const horizontal = window.matchMedia("(max-width: 700px)").matches;
    const railLength = horizontal ? track?.clientWidth : track?.clientHeight;
    if (!start || !track || !imageList || !railLength) return;

    const scrollPerPixel = imageList.getBoundingClientRect().height / railLength;
    const distance = horizontal ? event.clientX - start.x : event.clientY - start.y;
    window.scrollTo({ top: start.scrollY + distance * scrollPerPixel, behavior: "instant" });
  }

  return (
    <>
      <div className="project-editorial-gallery">
      <section className="project-editorial-stream" aria-label={`${title}项目介绍图片`}>
        {images.length > 0 ? <div ref={imageListRef} className="project-editorial-image-list">{images.map((image, index) => (
          <figure
            key={image.path}
            id={`project-image-${index + 1}`}
            data-image-index={index}
            className="project-editorial-image"
          >
            <Image
              src={image.path}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 70vw, 900px"
              className="h-auto w-full"
            />
          </figure>
        ))}</div> : (
          <div className="project-editorial-empty">项目介绍图片整理中</div>
        )}
      </section>

      {images.length > 1 && (
        <nav className="project-editorial-thumbnails" aria-label="项目图片目录">
          <div
            ref={thumbnailTrackRef}
            className="project-editorial-thumbnail-track"
            style={{ height: `min(68vh, ${images.length * 40}px)` }}
          >
          {images.map((image, index) => (
            <button
              key={image.path}
              type="button"
              className={`project-editorial-thumb ${active === index ? "is-active" : ""}`}
              aria-label={`查看第 ${index + 1} 张项目介绍图`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => showImage(index)}
              style={{ flexGrow: image.height / image.width }}
            >
              <Image src={image.path} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
          <button
            ref={viewportRef}
            type="button"
            className="project-editorial-viewport"
            aria-label="拖动线框浏览项目图片"
            onPointerDown={(event) => {
              dragRef.current = { x: event.clientX, y: event.clientY, scrollY: window.scrollY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={dragViewport}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                window.scrollBy({ top: window.innerHeight * (event.key === "ArrowDown" ? 0.6 : -0.6), behavior: "smooth" });
              }
            }}
          />
          </div>
        </nav>
      )}
      </div>
      <Link
        ref={nextPanelRef}
        href={`/projects/${nextProject.slug}`}
        className="project-editorial-next"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openProjectWithCurtain(`/projects/${nextProject.slug}`, nextProject.title, nextProject.english);
        }}
      >
        <span>下一项目</span>
        <strong className="text-[#E74E44]">{nextProject.title}</strong>
        {nextProject.english && <small>{nextProject.english}</small>}
      </Link>
    </>
  );
}
