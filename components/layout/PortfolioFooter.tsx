import { siteContent } from "@/lib/site-content";

type PortfolioFooterProps = {
  placement?: "overlay" | "flow" | "fixed";
  flushBottom?: boolean;
};

export function PortfolioFooter({ placement = "flow", flushBottom = false }: PortfolioFooterProps) {
  const placementClass = {
    overlay: `pointer-events-none absolute ${flushBottom ? "bottom-0" : "bottom-8"} left-0 right-0 z-[60]`,
    flow: "site-footer relative border-t",
    fixed: "site-footer fixed bottom-0 left-0 right-0 z-[80] border-t",
  }[placement];

  return (
    <footer className={`${placementClass} isolate flex flex-col gap-2 overflow-hidden px-6 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8`}>
      {(placement === "flow" || placement === "fixed") && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
          aria-hidden
        />
      )}
      <span className="shrink-0">
        {siteContent.footerTitle}
      </span>
      <div className="flex flex-col gap-1 sm:flex-row sm:gap-3 sm:text-right">
        <a href={`mailto:${siteContent.email}`} className="hover:text-white">
          Email: {siteContent.email}
        </a>
        <a href={`tel:${siteContent.phone}`} className="hover:text-white">
          手机/微信: {siteContent.phone}
        </a>
      </div>
    </footer>
  );
}
