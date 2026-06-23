'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  href?: string
  external?: boolean
}

export function ButtonColorful({
  className,
  label = "Khám phá ngay",
  href,
  external,
  ...props
}: ButtonColorfulProps) {
  const inner = (
    <Button
      className={cn(
        "relative h-11 px-7 overflow-hidden font-sans font-semibold text-sm rounded-xl",
        "bg-[var(--teal)] border border-white/30",
        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
        "group",
        className,
      )}
      {...props}
    >
      {/* Gradient glow */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-[#1D9E75] via-[#5DCAA5] to-[#0B3D5C]",
          "opacity-0 group-hover:opacity-80",
          "blur transition-opacity duration-500",
        )}
      />
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/90" />
      </div>
    </Button>
  )

  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    )
  }

  return inner
}
