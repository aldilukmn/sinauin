<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 1. Coding Philosophy & Architecture
- **Simplicity Over Cleverness**: Prefer simple, readable, and explicit code over clever abstractions. Do not over-engineer.
- **Single Responsibility (SRP)**: Keep logic strictly separated from UI. Extract complex state management into custom hooks (e.g., `useCetakNisn.ts`) and break down large UIs into smaller, focused components.
- **Clean Code**: Remove unused code instead of commenting it out. Do not add backward compatibility or fallback logic unless explicitly requested.
- **File Naming**: Use `.ts` for pure logic files and `.tsx` for React components.

## 2. Design & UI/UX Aesthetics
- **Premium Feel**: Focus on "Sederhana di luar, Premium di dalam." Use curated color palettes, soft shadows, and clean modern typography.
- **Framer Motion for Micro-Interactions**: Always use `framer-motion` for animations instead of raw CSS keyframes. Prioritize "spring" transitions for a natural, bouncy, and delightful feel. 
- **Avoid Heavy Effects**: NEVER use `backdrop-blur` for large background layers as it severely impacts frame rates on entry-level Android devices. Stick to solid colors (like `bg-white`) with soft shadows.

## 3. Mobile Responsiveness & Layout
- **Flexbox Safety**: Be extremely careful with flexbox centering (`items-center` / `justify-center`) on mobile screens. If a fixed-width element overflows its container, flexbox will force left-alignment (Safe Centering Fallback). Always ensure elements scale down or fit within the screen to maintain perfect center alignment.
- **Tailwind v4 Conventions**: Use standard Tailwind v4 utility classes. For gradients, use `bg-linear-to-*` instead of the deprecated `bg-gradient-to-*`.

## 4. Dependencies
- **Ask First**: Ask before introducing new dependencies. Leverage existing tools (`sonner` for toasts, `framer-motion` for animations, `lucide-react` for icons).
