export const dropdownPanelClass = "min-w-36 rounded-lg border border-white/10 bg-[#111] p-2 shadow-xl";
export const dropdownItemClass = "block rounded-md px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white sm:text-sm";
export const dropdownMotion = {
  initial: { opacity: 0, y: -7, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -5, scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 420, damping: 25, mass: 0.7 },
};
