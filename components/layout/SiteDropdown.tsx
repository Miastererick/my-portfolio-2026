"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { dropdownPanelClass, dropdownItemClass, dropdownMotion } from "./dropdown-style";

export function SiteDropdown({ label, ariaLabel, value, options, onSelect, triggerClassName, triggerStyle, active, id }: {
  label: string;
  ariaLabel: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  triggerClassName: string;
  triggerStyle?: CSSProperties;
  active?: boolean;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={root} className="relative shrink-0">
      <button ref={trigger} id={id} type="button" aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} data-active={active} className={triggerClassName} style={triggerStyle} onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => {
              const buttons = root.current?.querySelectorAll<HTMLButtonElement>("[role='menuitemradio']");
              (event.key === "ArrowUp" ? buttons?.[buttons.length - 1] : buttons?.[0])?.focus();
            });
          }
        }}>
        {label}
        <svg viewBox="0 0 16 16" className={`size-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      <AnimatePresence>
        {open && <motion.ul id={menuId} role="menu" aria-label={ariaLabel} {...dropdownMotion} transition={reduceMotion ? { duration: 0 } : dropdownMotion.transition} style={{ transformOrigin: "top center" }} className={`absolute right-0 top-full z-50 mt-2 ${dropdownPanelClass}`}
          onKeyDown={(event) => {
            const buttons = [...(root.current?.querySelectorAll<HTMLButtonElement>("[role='menuitemradio']") ?? [])];
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            let next = index;
            if (event.key === "ArrowDown") next = (index + 1) % buttons.length;
            else if (event.key === "ArrowUp") next = (index - 1 + buttons.length) % buttons.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = buttons.length - 1;
            else if (event.key === "Tab") { setOpen(false); return; }
            else return;
            event.preventDefault();
            buttons[next]?.focus();
          }}>
          {options.map((option) => <li key={option.value} role="none">
            <button type="button" role="menuitemradio" aria-checked={option.value === value} className={`w-full cursor-pointer whitespace-nowrap text-left ${dropdownItemClass}`} style={option.value === value ? { backgroundColor: "rgba(0, 0, 0, 0.05)" } : undefined} onClick={() => { onSelect(option.value); setOpen(false); trigger.current?.focus(); }}>{option.label}</button>
          </li>)}
        </motion.ul>}
      </AnimatePresence>
    </div>
  );
}
