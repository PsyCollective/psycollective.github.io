import { ReactNode } from "react";
import { DecorLeft, DecorRight, Bubbles } from "./DecorativeComponents";

const BG_BEIGE = "#F6EDE3";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`relative min-h-dvh overflow-hidden ${className}`} style={{ background: BG_BEIGE }}>
      <DecorLeft className="pointer-events-none fixed -left-8 top-16 w-40 opacity-60 z-0" />
      <DecorRight className="pointer-events-none fixed -right-6 bottom-20 w-44 opacity-70 z-0" />
      <Bubbles className="pointer-events-none fixed left-1/3 top-8 w-24 opacity-50 z-0" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}