import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl shadow-lg
        ${hover ? "hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
