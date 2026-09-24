"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProjectListItem } from "@/lib/portfolio-data";

type PreviewPosition = { left: number; top: number };

export function ProjectRowList({ projects }: { projects: ProjectListItem[] }) {
  const [activeProject, setActiveProject] = useState<ProjectListItem | null>(null);
  const [previewPosition, setPreviewPosition] = useState<PreviewPosition>({ left: 0, top: 0 });

  function updatePreviewPosition(clientX: number, clientY: number) {
    setPreviewPosition({
      left: Math.max(16, Math.min(clientX + 24, window.innerWidth - 376)),
      top: Math.max(16, Math.min(clientY - 130, window.innerHeight - 256)),
    });
  }

  return (
    <div className="relative">
      <div className="site-border-subtle border-t">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="site-border-subtle group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b py-5 transition-colors hover:border-white/35 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-5 sm:py-7"
            onMouseEnter={(event) => {
              setActiveProject(project);
              updatePreviewPosition(event.clientX, event.clientY);
            }}
            onMouseMove={(event) => updatePreviewPosition(event.clientX, event.clientY)}
            onMouseLeave={() => setActiveProject(null)}
            onFocus={() => {
              setActiveProject(project);
              setPreviewPosition({
                left: Math.max(16, window.innerWidth - 376),
                top: Math.max(16, Math.min(160, window.innerHeight - 256)),
              });
            }}
            onBlur={() => setActiveProject(null)}
          >
            <span className="self-start pt-1 font-mono text-xs text-white/35 sm:text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="site-primary-text block text-lg font-medium transition-colors group-hover:text-white sm:text-2xl">
                {project.title}
              </span>
              {project.english && (
                <span className="mt-1 block truncate text-xs tracking-wide text-white/40 sm:text-sm">
                  {project.english}
                </span>
              )}
              <span className="mt-2 hidden max-w-3xl text-sm leading-6 text-white/50 md:block">
                {project.summary}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <span className="relative block h-14 w-20 overflow-hidden rounded-md bg-white/5 md:hidden">
                <Image src={project.cover} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <span className="text-sm text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white">↗</span>
            </span>
          </Link>
        ))}
      </div>

      {activeProject && (
        <div
          className="pointer-events-none fixed z-[70] hidden aspect-[4/3] w-[340px] overflow-hidden rounded-xl border border-white/20 bg-[#111] shadow-2xl shadow-black/40 transition-opacity duration-150 md:block"
          style={{ left: previewPosition.left, top: previewPosition.top }}
          aria-hidden="true"
        >
          <Image src={activeProject.cover} alt="" fill sizes="340px" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
            <p className="text-sm text-white">{activeProject.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
