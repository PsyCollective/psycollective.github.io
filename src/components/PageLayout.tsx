import type {ReactNode} from "react";
import { DecorLeft, DecorRight, Bubbles } from "./DecorativeComponents";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`relative min-h-dvh bg-bg ${className}`}>
      <DecorLeft  className="pointer-events-none fixed left-0 top-16 w-40 opacity-60 z-0 text-[var(--color-accent-teal)]" />
      <DecorRight className="pointer-events-none fixed -right-6 bottom-20 w-44 opacity-70 z-0 text-[var(--color-accent-teal)]" />
      <Bubbles className="pointer-events-none fixed left-1/3 top-8 w-24 opacity-50 z-0" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
