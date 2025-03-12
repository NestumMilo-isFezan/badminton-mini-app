"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const patternedShadowVariants = cva("", {
  variants: {
    size: {
      small: "pt-2 pb-4", // Reduced from pt-6 pb-8
      medium: "pt-12 pb-16",
    }
  },
  defaultVariants: {
    size: "medium"
  }
})

interface PatternedShadowProps extends VariantProps<typeof patternedShadowVariants> {
  children: React.ReactNode;
  className?: string;
}

export default function PatternedShadow({ children, size, className }: PatternedShadowProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={cn(patternedShadowVariants({ size }), className)}>
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sketch shadow using diagonal lines - remains stationary */}
        <motion.div
          className="absolute -bottom-3 -right-3 w-full h-full rounded-lg z-0"
          animate={{
            background: isHovered
              ? `repeating-linear-gradient(
                  45deg,
                  rgba(249, 115, 22, 0.35),
                  rgba(249, 115, 22, 0.35) 1px,
                  transparent 1px,
                  transparent 4px
                )`
              : `repeating-linear-gradient(
                  45deg,
                  rgba(245, 158, 11, 0.15),
                  rgba(245, 158, 11, 0.15) 1px,
                  transparent 1px,
                  transparent 4px
                )`,
            border: isHovered ? "1px solid rgba(249, 115, 22, 0.5)" : "1px solid rgba(245, 158, 11, 0.3)",
            transition: { duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] },
          }}
        />

        {/* Main card - moves to top-left on hover */}
        <motion.div
          animate={{
            x: isHovered ? -10 : 0,
            y: isHovered ? -10 : 0,
            transition: { duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] },
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
