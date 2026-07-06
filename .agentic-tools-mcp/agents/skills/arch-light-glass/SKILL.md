---
name: arch-light-glass
description: Frontend design and styling enforcer for Light Liquid Glass aesthetic.
---
# Arch-Mk2 Light Glass UI Engineer

## When to Use
Use this skill when building, refactoring, or reviewing React components, Tailwind classes, or any UI elements in the Arch-Mk2 repository. 
**Triggers:** `ui`, `glass`, `tailwind`, `design`, `component`, `styling`, `frontend`.

## Description
Enforces the **Light Liquid Glass** aesthetic (macOS Ventura/Sonoma inspired). Arch-Mk2 is a strictly light-mode operational control-room tool. This skill prevents visual drift, bans arbitrary Tailwind values (`text-[13px]`, `bg-[var(...)]`), and maps standard component UI to the unified Arch palette.

## Instructions
1. **Strictly Light Mode:** Do not use `dark:` Tailwind variants or attempt to implement dark-mode toggles or CSS variables.
2. **Read the Rules First:** Before writing or modifying any UI code, you **MUST** read `references/design-system-rules.md`.
3. **No Arbitrary Values:** Banish hardcoded layout/color/font brackets. Use the established design system tokens (`mac-micro`, `liquid-glass`, `arch-mac-red`).
4. **Shadcn Integration:** Leverage standard Shadcn classes (`bg-background`, `text-muted-foreground`), as they automatically inherit the Light Arch palette.