# Arch-Mk2 Design System Rules

## 1. Light Mode Only (No `dark:`)
- **Rule:** Never use `dark:` prefixes in Tailwind. Never write CSS for `[data-theme="dark"]` or `.dark`.
- **Why:** The system is explicitly light-only (macOS Ventura/Sonoma) per `packages/theme/DECISIONS.md`. Maintaining dark-mode stubs creates dead CSS and architectural debt.

## 2. Liquid Glass Over Arbitrary Values
- **Rule:** Use `.liquid-glass`, `.liquid-glass-elevated`, or `.glass-macos` utility classes from `glass.css` instead of composing raw, arbitrary glass stacks.
- **Anti-pattern:** `className="bg-white/70 backdrop-blur-xl border border-black/[0.06]"`
- **Correct:** `className="liquid-glass"`

## 3. macOS Typography
- **Rule:** Use semantic macOS typography tokens for system labels, badges, and data density.
- **Anti-pattern:** `text-[11px]`, `text-[13px]`
- **Correct:** 
  - `text-mac-micro` (11px, 14px line-height) - For badges and system labels.
  - `text-mac-caption` (12px, 16px line-height) - For secondary subtext.
  - `text-mac-body` (13px, 18px line-height) - For standard UI text.

## 4. Shadcn UI Compatibility
- **Rule:** Use standard Shadcn utility classes for base layouts. They are automatically mapped to the Light Arch palette via HSL variables in `variables.css`.
- **Correct:** `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`.

## 5. Traffic Lights and Accents
- **Rule:** Use the `arch-mac-*` semantic aliases configured in `preset.ts` for macOS window controls and accents.
- **Anti-pattern:** `bg-[var(--mac-red)]`, `bg-[#ff5f56]`
- **Correct:** `bg-arch-mac-red`, `bg-arch-mac-yellow`, `bg-arch-mac-green`.

## 6. Global Layout Classes
- **Rule:** Do not scatter standard layout utility classes (e.g., `w-full max-w-7xl mx-auto px-4`). Use the globally shared layout classes defined in `packages/theme/src/css/layout.css`.
- **Utilities:**
  - `.page-container` (Standard 1400px centered responsive wrapper)
  - `.page-section` (Standard vertical spacing)
  - `.hero-section` (Responsive padded container with rounded corners)
  - `.content-grid-2` / `.content-grid-3` (Standard responsive grids)
  - `.skeleton-block` (Standard loading pulse using proper variables)