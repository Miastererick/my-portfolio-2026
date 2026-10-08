export const dropdownPanelClass = "site-dropdown-panel min-w-36 rounded-xl bg-[var(--background)] p-1.5";
export const dropdownItemClass = "site-dropdown-item block rounded-lg px-3 py-2.5 text-xs transition-colors sm:text-sm";
export const dropdownMotion = {
  initial: { opacity: 0, y: -7, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -5, scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 420, damping: 25, mass: 0.7 },
};
