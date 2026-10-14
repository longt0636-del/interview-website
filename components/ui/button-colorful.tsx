import { cn } from "@/lib/utils"

interface ButtonColorfulProps {
  label: string
  href: string
  external?: boolean
  className?: string
}

export function ButtonColorful({ className, label, href, external }: ButtonColorfulProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative inline-flex h-11 items-center justify-center whitespace-nowrap overflow-hidden px-7 rounded-xl",
        "font-sans font-semibold text-sm bg-[var(--teal)] border border-white/30",
        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Gradient glow */}
      <span
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-[#1D9E75] via-[#5DCAA5] to-[#0B3D5C]",
          "opacity-0 group-hover:opacity-80",
          "blur transition-opacity duration-500",
        )}
      />
      <span className="relative flex items-center justify-center gap-2 text-white">
        {label}
        <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 7h10v10M7 17 17 7" />
        </svg>
      </span>
    </a>
  )
}
